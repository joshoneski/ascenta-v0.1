import { db } from '@/db'
import {
    emailVerifications,
    enrichedContactsView,
    personPersonas,
} from '@/db/schema'
import { formatLocation } from '@/server/contacts/common/location'
import { ContactId } from '@/server/contacts/contact.entity'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import {
    ContactDetailsDTO,
    ContactEnrichmentDetailsDTO,
    ContactExportListItemDTO,
    ContactListItemDTO,
} from '@/shared/dtos/contact.dto'
import { and, asc, count, desc, eq } from 'drizzle-orm'

export const contactsReadRepo = {
    getContactCount: async (
        organisationId: OrganisationId
    ): Promise<number> => {
        const [result] = await db
            .select({ count: count() })
            .from(enrichedContactsView)
            .where(
                and(
                    eq(
                        enrichedContactsView.organisationId,
                        organisationId.value
                    )
                )
            )

        return result?.count ?? 0
    },
    getContactDetails: async (
        contactId: ContactId
    ): Promise<ContactDetailsDTO | null> => {
        const [result] = await db
            .select({
                id: enrichedContactsView.id,
                email: enrichedContactsView.email,
                emailStatus: emailVerifications.status,
                firstName: enrichedContactsView.firstName,
                lastName: enrichedContactsView.lastName,
                createdAt: enrichedContactsView.createdAt,
                city: enrichedContactsView.city,
                country: enrichedContactsView.country,
                region: enrichedContactsView.region,
                company: enrichedContactsView.company,
                profession: enrichedContactsView.profession,
                enrichmentScore: enrichedContactsView.enrichmentScore,
                organisation: enrichedContactsView.organisationId,
                person: enrichedContactsView.personId,
            })
            .from(enrichedContactsView)
            .leftJoin(
                emailVerifications,
                eq(
                    emailVerifications.id,
                    enrichedContactsView.emailVerificationId
                )
            )
            .where(eq(enrichedContactsView.id, contactId.value))

        if (!result) {
            return null
        }

        return {
            id: result.id,
            email: result.email,
            emailStatus: result.emailStatus ?? 'unverified',
            firstName: result.firstName,
            lastName: result.lastName,
            createdAt: result.createdAt.getTime(),
            location: formatLocation(
                result.city,
                result.region,
                result.country
            ),
            company: result.company,
            profession: result.profession,
            enrichmentScore: result.enrichmentScore
                ? Math.floor(result.enrichmentScore)
                : null,
            isEnriched: !!result.person,
            organisation: result.organisation,
        }
    },
    getContactList: async (criteria: {
        filter: {
            organisationId: OrganisationId
        }
        skip: number
        limit: number
    }): Promise<ContactListItemDTO[]> => {
        return db
            .select({
                id: enrichedContactsView.id,
                email: enrichedContactsView.email,
                emailStatus: emailVerifications.status,
                firstName: enrichedContactsView.firstName,
                lastName: enrichedContactsView.lastName,
            })
            .from(enrichedContactsView)
            .leftJoin(
                emailVerifications,
                eq(
                    emailVerifications.id,
                    enrichedContactsView.emailVerificationId
                )
            )
            .where(
                eq(
                    enrichedContactsView.organisationId,
                    criteria.filter.organisationId.value
                )
            )
            .orderBy(desc(enrichedContactsView.createdAt))
            .offset(criteria.skip)
            .limit(criteria.limit)
    },
    getContactEnrichmentDetails: async (
        contactId: ContactId
    ): Promise<ContactEnrichmentDetailsDTO | null> => {
        const [result] = await db
            .select({
                id: enrichedContactsView.id,
                summary: personPersonas.summary,
                motivations: personPersonas.motivations,
                communicationStyle: personPersonas.communicationStyle,
                potentialObjections: personPersonas.potentialObjections,
                engagementSuggestions: personPersonas.engagementSuggestions,
                organisation: enrichedContactsView.organisationId,
                person: enrichedContactsView.personId,
            })
            .from(enrichedContactsView)
            .leftJoin(
                personPersonas,
                eq(enrichedContactsView.personId, personPersonas.personId)
            )
            .where(eq(enrichedContactsView.id, contactId.value))

        if (!result || !result.person) {
            return null
        }

        return result
    },
    getContactExportDetails: async (
        organisationId: OrganisationId
    ): Promise<ContactExportListItemDTO[]> => {
        return await db
            .select({
                firstName: enrichedContactsView.firstName,
                lastName: enrichedContactsView.lastName,
                email: enrichedContactsView.email,
                emailStatus: emailVerifications.status,
                city: enrichedContactsView.city,
                country: enrichedContactsView.country,
                region: enrichedContactsView.region,
                company: enrichedContactsView.company,
                profession: enrichedContactsView.profession,
            })
            .from(enrichedContactsView)
            .leftJoin(
                emailVerifications,
                eq(
                    enrichedContactsView.emailVerificationId,
                    emailVerifications.id
                )
            )
            .where(
                eq(enrichedContactsView.organisationId, organisationId.value)
            )
            .orderBy(asc(enrichedContactsView.createdAt))
    },
}
