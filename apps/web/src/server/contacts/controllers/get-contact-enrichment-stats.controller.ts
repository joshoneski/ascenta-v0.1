import { analyticsReadRepository } from '@/server/analytics/analytics-read-repository'
import {
    ContactEnrichmentStatsRequest,
    ContactEnrichmentStatsResult,
} from '@/server/contacts/contact.types'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'

export async function getContactEnrichmentStatsController(
    request: ContactEnrichmentStatsRequest
): Promise<ContactEnrichmentStatsResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const stats = await analyticsReadRepository.getDashboardStats(
        organisation.id
    )
    if (!stats) {
        return {
            enrichedContacts: 0,
            totalContacts: 0,
        }
    }

    return {
        enrichedContacts: stats.enrichedContacts,
        totalContacts: stats.totalContacts,
    }
}
