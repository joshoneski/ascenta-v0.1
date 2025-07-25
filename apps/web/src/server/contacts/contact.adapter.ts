import { contacts, enrichedContactsView } from '@/db/schema'
import {
    ContactEntity,
    ContactId,
    EnrichedContactEntity,
    EnrichedContactId,
} from '@/server/contacts/contact.entity'
import { EmailVerificationEntity } from '@/server/email-verification/email-verification.entity'
import {
    PersonEnrichmentScore,
    PersonEntity,
    PersonId,
} from '@/server/enrichment/person.entity'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { ContactDTO, ContactListItemDTO } from '@/shared/dtos/contact.dto'

export const contactAdapters = {
    dbToEntity: (contact: typeof contacts.$inferSelect): ContactEntity =>
        new ContactEntity(
            new ContactId(contact.id),
            new OrganisationId(contact.organisationId),
            contact.personId ? new PersonId(contact.personId) : null,
            contact.email,
            contact.firstName,
            contact.lastName,
            contact.createdAt
        ),

    entityToDTO: (contact: ContactEntity): ContactDTO => ({
        id: contact.id.value,
        createdAt: contact.createdAt.getTime(), // TODO: keep as number or date?
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        organisation: contact.organisationId.value,
    }),

    entityToListDTO: (
        enrichedContact: EnrichedContactEntity,
        emailVerification: EmailVerificationEntity | null
    ): ContactListItemDTO => ({
        id: enrichedContact.id.value,
        email: enrichedContact.email,
        firstName: enrichedContact.firstName,
        lastName: enrichedContact.lastName,
        emailStatus: emailVerification?.props.status ?? null,
    }),
}

export const enrichedContactAdapters = {
    dbToEntity: (contact: typeof enrichedContactsView.$inferSelect) =>
        new EnrichedContactEntity(
            new ContactId(contact.id),
            new OrganisationId(contact.organisationId),
            contact.personId ? new PersonId(contact.personId) : null,
            contact.email,
            contact.firstName,
            contact.lastName,
            contact.createdAt,
            contact.city,
            contact.country,
            contact.region,
            contact.company,
            contact.profession,
            new PersonEnrichmentScore(contact.enrichmentScore ?? 0)
        ),

    fromContactAndPerson: (
        contact: ContactEntity,
        person: PersonEntity | null
    ) =>
        new EnrichedContactEntity(
            new EnrichedContactId(contact.id.value),
            contact.organisationId,
            contact.personId,
            contact.email,
            contact.firstName || person?.props.firstName || null,
            contact.lastName || person?.props.lastName || null,
            contact.createdAt,
            person?.props.city ?? null,
            person?.props.country ?? null,
            person?.props.region ?? null,
            person?.props.company ?? null,
            person?.props.profession ?? null,
            person?.props.enrichmentScore ?? null
        ),
}
