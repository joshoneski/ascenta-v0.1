import { CampaignOptionDto } from '@/modules/campaigns'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { segmentReadRepository } from '@/server/segments/segment-read-repository'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function getSegmentOptionsController(
    organisationId: string,
    user: UserDTO
): Promise<CampaignOptionDto[]> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    return segmentReadRepository.getSegmentOptions({
        filter: {
            organisationId: organisation.id,
        },
    })
}
