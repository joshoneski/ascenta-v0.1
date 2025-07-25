import { db } from '@/db'
import { contacts } from '@/db/schema'
import { sendSlackSupportNotification } from '@/server/_lib/slack'
import { RequestContext } from '@/server/_utils/request'
import { checkAdminAccess } from '@/server/auth/use-cases/is-admin.use-case'
import { contactsReadRepo } from '@/server/contacts/contact-read-repository'
import { ContactEntity, ContactId } from '@/server/contacts/contact.entity'
import { getContactUseCase } from '@/server/contacts/use-cases/get-contact.use-case'
import { verifyContactEmailUseCase } from '@/server/contacts/use-cases/verify-contact-email.use-case'
import { EmailVerificationEntity } from '@/server/email-verification/email-verification.entity'
import { createEmailVerificationUseCase } from '@/server/email-verification/use-cases/create-email-verification.use-case'
import { getLatestEmailVerificationByEmailUseCase } from '@/server/email-verification/use-cases/get-latest-email-verification-by-email.use-case'
import { PersonEntity } from '@/server/enrichment/person.entity'
import { enrichPersonUseCase } from '@/server/enrichment/use-cases/enrich-person.use-case'
import { getPersonByEmailUseCase } from '@/server/enrichment/use-cases/get-person-by-email.use-case'
import { getPersonPersonaUseCase } from '@/server/enrichment/use-cases/get-person-persona.use-case'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError } from '@/shared/errors'
import { eq } from 'drizzle-orm'

export async function enrichContactController(
    ctx: RequestContext,
    contactId: string,
    organisationId: string,
    user: UserDTO
) {
    if (
        ctx.actor.type !== 'system' &&
        !(await checkAdminAccess(ctx.actor.id))
    ) {
        await sendSlackSupportNotification(
            'Feature Access Denied',
            [
                'User tried to enrich a contact.',
                '',
                `User: ${ctx.actor.id}`,
                `Contact: ${contactId}`,
                `Organisation: ${ctx.organisation?.id}`,
            ].join('\n')
        )
        throw new ForbiddenError(
            'You do not have access to this feature. Please contact support@littlephil.org for assistance.'
        )
    }

    const organisation = await getOrganisationUseCase(organisationId, user)

    const contact = await getContactUseCase(ctx, new ContactId(contactId))

    const emailVerification = await gerOrUpdateEmailVerification(
        ctx,
        contact,
        organisation,
        user
    )

    const { person } = await getOrUpdatePerson(contact, organisation, user)

    await attachToContact(contact, emailVerification, person)

    // TODO: should return nothing
    return contactsReadRepo.getContactEnrichmentDetails(contact.id)
}

async function attachToContact(
    contact: ContactEntity,
    emailVerification: EmailVerificationEntity,
    person: PersonEntity
) {
    await db
        .update(contacts)
        .set({
            emailVerificationId: emailVerification.props.id,
            personId: person.props.id.value,
        })
        .where(eq(contacts.id, contact.id.value))
}

async function gerOrUpdateEmailVerification(
    ctx: RequestContext,
    contact: ContactEntity,
    organisation: OrganisationEntity,
    user: UserDTO
) {
    const emailVerification = await getLatestEmailVerificationByEmailUseCase(
        contact.email,
        organisation,
        user
    )
    if (emailVerification) {
        return emailVerification
    }

    const verification = await verifyContactEmailUseCase(ctx, contact.email)

    return await createEmailVerificationUseCase(
        {
            email: contact.email,
            status: verification.status,
            blacklisted: verification.checks.blacklisted,
            disposable: verification.checks.disposable,
            deliverable: verification.checks.deliverable,
            roleBased: verification.checks.roleBased,
            syntax: verification.checks.syntax,
        },
        contact,
        organisation,
        user
    )
}

async function getOrUpdatePerson(
    contact: ContactEntity,
    organisation: OrganisationEntity,
    user: UserDTO
) {
    const existingPerson = await getPersonByEmailUseCase(contact.email, user)
    if (existingPerson && !existingPerson.isDueForFreshEnrichment) {
        const personPersona = await getPersonPersonaUseCase(
            existingPerson.props.id,
            user
        )
        if (personPersona) {
            return {
                person: existingPerson,
                personPersona,
            }
        }
    }

    return enrichPersonUseCase(contact.email, organisation, user)
}
