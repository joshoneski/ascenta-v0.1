import { db } from '@/db'
import { campaignEmails, campaigns } from '@/db/schema'
import { inngest } from '@/modules/background-tasks/infrastructure/inngest-client'
import { getCampaignContactsUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-contacts.use-case'
import { getCampaignEmailUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-email.use-case'
import { CampaignEmailDeliveryEntity } from '@/modules/campaigns/domain/campaign-email-delivery.entity'
import { campaignEmailDeliveryRepository } from '@/modules/campaigns/infrastructure/campaign-email-delivery-repository'
import { campaignEmailRepository } from '@/modules/campaigns/infrastructure/campaign-email-repository'
import { getSystemAuth } from '@/server/auth/get-system-auth'
import { backendConfig } from '@/server/backend-config'
import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const scheduleCampaignEmailsTask = inngest.createFunction(
    {
        id: 'schedule-campaign-emails',
    },
    {
        cron:
            backendConfig.APP_ENV === 'local'
                ? // every minute
                  '* * * * *'
                : // every hour
                  '0 * * * *',
    },
    async ({ event, step }) => {
        const { buildSystemRequestContext } = getSystemAuth()
        const ctx = buildSystemRequestContext('inngress', 'cron')

        const readyToSchedule = await step.run(
            'get-upcoming-emails',
            async () => {
                const now = new Date()

                const dueCandidates = await db
                    .select({
                        campaignId: campaigns.id,
                        campaignStartedAt: campaigns.startedAt,
                        campaignPausedAt: campaigns.pausedAt,
                        campaignTotalPausedMs: campaigns.totalPausedMs,
                        campaignEmailId: campaignEmails.id,
                        campaignEmailStartOffsetMs:
                            campaignEmails.startOffsetMs,
                    })
                    .from(campaigns)
                    .innerJoin(
                        campaignEmails,
                        eq(campaigns.id, campaignEmails.campaignId)
                    )
                    .where(
                        and(
                            eq(campaigns.status, 'running'),
                            eq(campaignEmails.status, 'ready')
                        )
                    )

                return dueCandidates
                    .filter((row) => {
                        if (!row.campaignStartedAt) {
                            return false
                        }

                        const nowMs = now.getTime()

                        const pausedNow = row.campaignPausedAt
                            ? nowMs - row.campaignPausedAt.getTime()
                            : 0

                        const effectiveElapsed =
                            nowMs -
                            row.campaignStartedAt.getTime() -
                            row.campaignTotalPausedMs -
                            pausedNow

                        return (
                            effectiveElapsed >= row.campaignEmailStartOffsetMs
                        )
                    })
                    .map((dueCandidate) => ({
                        campaignEmailId: dueCandidate.campaignEmailId,
                    }))
            }
        )

        for (const item of readyToSchedule) {
            await step.run('schedule-email-sends', async () => {
                const campaignEmail = await getCampaignEmailUseCase(
                    ctx,
                    item.campaignEmailId
                )

                const contacts = await getCampaignContactsUseCase(
                    ctx,
                    campaignEmail.props.campaignId
                )

                if (contacts.length === 0) {
                    return `Scheduled emails for 0 contacts.`
                }

                await db.transaction(async (tx) => {
                    const now = new Date()
                    const deliveries = contacts.map((contact) => {
                        return new CampaignEmailDeliveryEntity({
                            id: uuidv4(),
                            campaignId: campaignEmail.props.campaignId,
                            campaignContactId: contact.id,
                            campaignEmailId: campaignEmail.props.id,
                            organisationId: campaignEmail.props.organisationId,
                            createdAt: now,
                            error: null,
                            status: 'scheduled',
                            statusUpdatedAt: now,
                            senderEmail: null,
                            senderName: null,
                            recipientEmail: null,
                            subject: campaignEmail.props.subject,
                            html: null,
                        })
                    })

                    // Note: If Inngest fails the transaction will be rolled back
                    await campaignEmailDeliveryRepository.saveMany(
                        deliveries,
                        tx
                    )

                    await inngest.send(
                        deliveries.map((delivery) => {
                            return {
                                name: 'campaign.email.delivery.scheduled',
                                data: {
                                    campaignEmailDeliveryId: delivery.props.id,
                                    organisationId:
                                        campaignEmail.props.organisationId,
                                },
                            }
                        })
                    )

                    return `Scheduled emails for ${contacts.length} contacts.`
                })
            })

            await step.run('mark-as-scheduled', async () => {
                const campaignEmail = await getCampaignEmailUseCase(
                    ctx,
                    item.campaignEmailId
                )

                campaignEmail.props.status = 'scheduled'

                await campaignEmailRepository.save(campaignEmail)

                return campaignEmail
            })
        }
    }
)
