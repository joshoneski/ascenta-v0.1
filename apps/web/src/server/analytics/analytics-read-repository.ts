import { db } from '@/db'
import { emailVerifications, enrichedContactsView } from '@/db/schema'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { OrganisationContactStatsDTO } from '@/shared/dtos/analytics.dto'
import { count, eq, sql } from 'drizzle-orm'

export const analyticsReadRepository = {
    getDashboardStats: async (
        organisation: OrganisationId
    ): Promise<OrganisationContactStatsDTO | null> => {
        const [result] = await db
            .select({
                totalContacts: count(enrichedContactsView),
                enrichedContacts: count(enrichedContactsView.enrichmentScore),
                verifiedContacts: sql<number>`count(*) filter (where
                ${eq(emailVerifications.status, 'valid')}
                )`.mapWith(Number),
            })
            .from(enrichedContactsView)
            .leftJoin(
                emailVerifications,
                eq(
                    enrichedContactsView.emailVerificationId,
                    emailVerifications.id
                )
            )
            .where(eq(enrichedContactsView.organisationId, organisation.value))

        if (!result) {
            return null
        }

        const enrichmentRate = result.enrichedContacts / result.totalContacts
        return {
            totalContacts: result.totalContacts,
            enrichedContacts: result.enrichedContacts,
            verifiedContacts: result.verifiedContacts,
            enrichmentRate: isNaN(enrichmentRate) ? 0 : enrichmentRate,
        }
    },
}
