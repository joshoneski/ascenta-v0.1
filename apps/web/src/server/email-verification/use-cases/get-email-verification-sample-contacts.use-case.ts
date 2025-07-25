import { db } from '@/db'
import { emailVerifications, enrichedContactsView } from '@/db/schema'
import { enrichedContactAdapters } from '@/server/contacts/contact.adapter'
import { emailVerificationsAdapters } from '@/server/email-verification/email-verification.adapter'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { and, desc, eq, isNull, or } from 'drizzle-orm'

export async function getEmailVerificationSampleContactsUseCase(
    organisation: OrganisationEntity,
    user: UserDTO
) {
    const results = await db
        .select()
        .from(enrichedContactsView)
        .leftJoin(
            emailVerifications,
            eq(emailVerifications.id, enrichedContactsView.emailVerificationId)
        )
        .where(
            and(
                eq(enrichedContactsView.organisationId, organisation.id.value),
                or(
                    eq(emailVerifications.status, 'unverified'),
                    isNull(emailVerifications.status)
                )
            )
        )
        .orderBy(desc(enrichedContactsView.createdAt))
        .limit(5)

    return results.map(({ enriched_contacts_view, email_verifications }) => {
        return {
            enrichedContact: enrichedContactAdapters.dbToEntity(
                enriched_contacts_view
            ),
            emailVerification: email_verifications
                ? emailVerificationsAdapters.dbToEntity(email_verifications)
                : null,
        }
    })
}
