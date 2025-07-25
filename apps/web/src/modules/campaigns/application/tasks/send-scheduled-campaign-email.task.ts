import { db } from '@/db'
import { inngest } from '@/modules/background-tasks/infrastructure/inngest-client'
import { createPersonalisedEmailUseCase } from '@/modules/campaigns/application/use-cases/create-personalised-email.use-case'
import { getCampaignContactUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-contact.use-case'
import { getCampaignEmailDeliveryUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-email-delivery.use-case'
import { getCampaignEmailUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-email.use-case'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { markCampaignAsCompletedIfNeededUseCase } from '@/modules/campaigns/application/use-cases/mark-campaign-as-completed-if-needed.use-case'
import { markCampaignEmailAsCompletedIfNeededUseCase } from '@/modules/campaigns/application/use-cases/mark-campaign-email-as-completed-if-needed.use-case'
import { campaignEmailDeliveryRepository } from '@/modules/campaigns/infrastructure/campaign-email-delivery-repository'
import { createClickUseCase } from '@/modules/clicks/application/use-cases/create-click.use-case'
import { absoluteClickUrl } from '@/modules/clicks/click.utils'
import { getDomainEntityUseCase } from '@/modules/domains/application/use-cases/get-domain-entity.use-case'
import { getDomainSenderUseCase } from '@/modules/domains/application/use-cases/get-domain-sender.use-case'
import { DomainId } from '@/modules/domains/domain/domain.entity'
import { resend } from '@/server/_lib/resend'
import { getSystemAuth } from '@/server/auth/get-system-auth'
import { backendConfig } from '@/server/backend-config'
import { contactsReadRepo } from '@/server/contacts/contact-read-repository'
import { ContactId } from '@/server/contacts/contact.entity'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { hexForegroundColour } from '@/shared/colour'
import { Button as EmailButton } from '@ascenta-plus/emails/components/Button'
import { Stack as EmailStack } from '@ascenta-plus/emails/components/Stack'
import { Text as EmailText } from '@ascenta-plus/emails/components/Text'
import BasicEmail from '@ascenta-plus/emails/emails/BasicEmail'
import { render } from '@react-email/render'

const whitelistedEmailAddresses = [
    'shippy@littlephil.org',
    'matias@littlephil.org',
    'josh@littlephil.org',
]

export const sendScheduledCampaignEmailTask = inngest.createFunction(
    {
        id: 'send-scheduled-campaign-email',
        concurrency: [
            {
                // Tenant limit
                key: 'event.data.organisationId',
                limit: 1,
            },
            {
                // Global limit
                limit: 20,
            },
        ],
        onFailure: async ({ event, error }) => {
            // if the task fails after all retries, mark as failed
            await db.transaction(async (tx) => {
                const { campaignEmailDeliveryId } = event.data.event.data
                const { buildSystemRequestContext } = getSystemAuth()
                const ctx = buildSystemRequestContext('inngress', 'job')

                await db.transaction(async (tx) => {
                    const delivery = await getCampaignEmailDeliveryUseCase(
                        ctx,
                        campaignEmailDeliveryId
                    )

                    delivery.markAsFailed(error.message)
                    await campaignEmailDeliveryRepository.save(delivery)

                    await markCampaignEmailAsCompletedIfNeededUseCase(
                        ctx,
                        delivery.props.campaignEmailId,
                        tx
                    )
                    await markCampaignAsCompletedIfNeededUseCase(
                        ctx,
                        delivery.props.campaignId,
                        tx
                    )
                })
            })
        },
    },
    { event: 'campaign.email.delivery.scheduled' },
    async ({ event, step }) => {
        const { campaignEmailDeliveryId } = event.data
        const { buildSystemRequestContext, getSystemUser } = getSystemAuth()
        const ctx = buildSystemRequestContext('inngress', 'job')
        const systemUser = await getSystemUser()

        const metadata = await step.run('fetch-metadata', async () => {
            const delivery = await getCampaignEmailDeliveryUseCase(
                ctx,
                campaignEmailDeliveryId
            )

            const [campaign, campaignEmail, campaignContact, organisation] =
                await Promise.all([
                    getCampaignUseCase(
                        delivery.props.campaignId,
                        delivery.props.organisationId,
                        systemUser
                    ),
                    getCampaignEmailUseCase(
                        ctx,
                        delivery.props.campaignEmailId
                    ),
                    getCampaignContactUseCase(
                        ctx,
                        delivery.props.campaignContactId
                    ),
                    getOrganisationUseCase(
                        delivery.props.organisationId,
                        systemUser
                    ),
                ])

            if (!campaign.props.domainSenderId) {
                throw new Error(
                    'Unable to send email due to campaign having no sender.'
                )
            }

            if (!campaignContact) {
                throw new Error('Contact not found.')
            }

            const [contact, sender] = await Promise.all([
                contactsReadRepo.getContactDetails(
                    new ContactId(campaignContact.contactId)
                ),
                getDomainSenderUseCase(ctx, campaign.props.domainSenderId),
            ])

            if (!contact) {
                throw new Error('Contact not found.')
            } else if (!sender) {
                throw new Error('Sender not found.')
            }

            const domain = await getDomainEntityUseCase(
                ctx,
                new DomainId(sender.props.domainId)
            )

            if (!domain) {
                throw new Error('Domain not found.')
            }

            return {
                campaign,
                campaignEmail,
                campaignContact,
                contact,
                domain,
                sender,
                organisation: {
                    ...organisation,
                    id: organisation.id.value,
                },
            }
        })

        await step.run('mark-as-processing', async () => {
            const delivery = await getCampaignEmailDeliveryUseCase(
                ctx,
                campaignEmailDeliveryId
            )

            delivery.markAsProcessing()
            await campaignEmailDeliveryRepository.save(delivery)
        })

        const personalisedEmail = await step.run(
            'create-personalised-email',
            async () => {
                return createPersonalisedEmailUseCase({
                    contactFirstName: metadata.contact.firstName,
                    charityName: metadata.organisation.displayName,
                    contentFocus: metadata.campaignEmail.props.contentFocus,
                    sample: metadata.campaignEmail.props.sample,
                    strategy: metadata.campaign.props.strategy,
                    summary: metadata.campaign.props.summary,
                })
            }
        )

        await step.run('update-processing-email-details', async () => {
            const delivery = await getCampaignEmailDeliveryUseCase(
                ctx,
                campaignEmailDeliveryId
            )

            await db.transaction(async (tx) => {
                const click = await createClickUseCase(
                    {
                        organisationId: metadata.organisation.id,
                        destinationUrl: metadata.campaign.props.ctaUrl,
                        type: 'email',
                        metadata: {
                            campaignId: metadata.campaign.props.id,
                            campaignContactId: metadata.campaignContact.id,
                            campaignEmailId: metadata.campaignEmail.props.id,
                            contactId: metadata.contact.id,
                            domainId: metadata.domain.id,
                            senderId: metadata.sender.props.id,
                            deliveryId: delivery.props.id,
                        },
                    },
                    tx
                )

                const html = await render(
                    BasicEmail({
                        children: EmailStack({
                            children: personalisedEmail.blocks.map((block) => {
                                switch (block.type) {
                                    case 'button':
                                        return EmailButton({
                                            children: block.text,
                                            href: absoluteClickUrl(click),
                                            style: {
                                                backgroundColor:
                                                    metadata.organisation
                                                        .primaryColor,
                                                color: hexForegroundColour(
                                                    metadata.organisation
                                                        .primaryColor
                                                ),
                                            },
                                        })
                                    case 'title':
                                        return EmailText({
                                            children: block.text,
                                            variant: 'h1',
                                        })
                                    case 'paragraph':
                                        return EmailText({
                                            children: block.text,
                                        })
                                }
                            }),
                        }),
                    }),
                    {
                        pretty: true,
                    }
                )

                delivery.props.subject = personalisedEmail.subject
                delivery.props.html = html

                await campaignEmailDeliveryRepository.save(delivery, tx)
            })
        })

        const emailDetails = await step.run('send-email', async () => {
            const delivery = await getCampaignEmailDeliveryUseCase(
                ctx,
                campaignEmailDeliveryId
            )

            if (!delivery.props.subject) {
                throw new Error('Missing subject for processing email.')
            } else if (!delivery.props.html) {
                throw new Error('Missing html for processing email.')
            }

            const emailDetails = {
                sender: {
                    email: `${metadata.sender.props.username}@${metadata.domain.domain}`,
                    name: metadata.sender.props.name,
                },
                recipient: {
                    email: metadata.contact.email,
                },
            }

            const isWhitelisted = whitelistedEmailAddresses.includes(
                emailDetails.recipient.email
            )
            if (backendConfig.APP_ENV !== 'production' && !isWhitelisted) {
                throw new Error(
                    'You can only send testing emails to white listed email addresses.'
                )
            }

            const response = await resend.emails.send({
                to: emailDetails.recipient.email,
                from: `${emailDetails.sender.name} <${emailDetails.sender.email}>`,
                subject: delivery.props.subject,
                html: delivery.props.html,
            })
            if (response.error) {
                throw response.error
            }

            return emailDetails
        })

        await step.run('mark-as-sent', async () => {
            const delivery = await getCampaignEmailDeliveryUseCase(
                ctx,
                campaignEmailDeliveryId
            )

            delivery.markAsSent()
            delivery.props.senderEmail = emailDetails.sender.email
            delivery.props.senderName = emailDetails.sender.name
            delivery.props.recipientEmail = emailDetails.recipient.email

            await campaignEmailDeliveryRepository.save(delivery)
        })

        await step.run('update-campaign-status', async () => {
            const delivery = await getCampaignEmailDeliveryUseCase(
                ctx,
                campaignEmailDeliveryId
            )

            await db.transaction(async (tx) => {
                await markCampaignEmailAsCompletedIfNeededUseCase(
                    ctx,
                    delivery.props.campaignEmailId,
                    tx
                )
                await markCampaignAsCompletedIfNeededUseCase(
                    ctx,
                    delivery.props.campaignId,
                    tx
                )
            })
        })
    }
)
