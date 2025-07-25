import { analyticsReadRepository } from '@/server/analytics/analytics-read-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { OrganisationContactStatsDTO } from '@/shared/dtos/analytics.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function getDashboardStatsController(
    organisationId: string,
    user: UserDTO
): Promise<OrganisationContactStatsDTO> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const stats = await analyticsReadRepository.getDashboardStats(
        organisation.id
    )
    if (!stats) {
        return {
            totalContacts: 0,
            enrichmentRate: 0,
            enrichedContacts: 0,
            verifiedContacts: 0,
        }
    }

    return stats
}
