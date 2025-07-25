import { db } from '@/db'
import { contacts, emailVerifications } from '@/db/schema'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { count, desc, eq, isNull, or } from 'drizzle-orm'

export async function countUnverifiedContactsUseCase(
    organisation: OrganisationEntity,
    user: UserDTO
) {
    const contactsWithLatestEmailStatus = db
        .selectDistinctOn([contacts.createdAt, contacts.id])
        .from(contacts)
        .leftJoin(
            emailVerifications,
            eq(emailVerifications.id, contacts.emailVerificationId)
        )
        .where(eq(contacts.organisationId, organisation.id.value))
        .orderBy(
            desc(contacts.createdAt),
            desc(contacts.id),
            desc(emailVerifications.createdAt)
        )
        .as('temp')

    const [result] = await db
        .select({ count: count() })
        .from(contactsWithLatestEmailStatus)
        .where(
            or(
                eq(
                    contactsWithLatestEmailStatus.email_verifications.status,
                    'unverified'
                ),
                isNull(contactsWithLatestEmailStatus.email_verifications.status)
            )
        )

    return result ? result.count : 0
}
