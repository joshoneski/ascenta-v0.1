import {
    CampaignMetadataRequest,
    CampaignMetadataResult,
} from '@/modules/campaigns/campaigns.types'
import { campaignReadRepository } from '@/modules/campaigns/infrastructure/campaign-read-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { NotFoundError } from '@/shared/errors'

export async function getCampaignMetadataController(
    request: CampaignMetadataRequest
): Promise<CampaignMetadataResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const metadata = await campaignReadRepository.getCampaignMetadata({
        filter: {
            campaignId: request.id,
            organisationId: organisation.id.value,
        },
    })

    if (!metadata) {
        throw new NotFoundError('Campaign not found.')
    }

    return metadata
}
