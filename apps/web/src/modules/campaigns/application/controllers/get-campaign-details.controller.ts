import {
    CampaignDetailsRequest,
    CampaignDetailsResult,
} from '@/modules/campaigns/campaigns.types'
import { campaignReadRepository } from '@/modules/campaigns/infrastructure/campaign-read-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { NotFoundError } from '@/shared/errors'

export async function getCampaignDetailsController(
    request: CampaignDetailsRequest
): Promise<CampaignDetailsResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const details = await campaignReadRepository.getDetails({
        filter: {
            campaignId: request.id,
            organisationId: organisation.id.value,
        },
    })

    if (!details) {
        throw new NotFoundError('Campaign not found.')
    }

    return details
}
