import {
    CampaignUpdateRequest,
    CampaignUpdateResponse,
} from '@/modules/campaigns'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { campaignRepository } from '@/modules/campaigns/infrastructure/campaign-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { BadRequestError } from '@/shared/errors'

export async function updateCampaignController(
    request: CampaignUpdateRequest
): Promise<CampaignUpdateResponse> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const campaign = await getCampaignUseCase(
        request.campaignId,
        organisation.id.value,
        request.user
    )

    if (request.update.title) {
        campaign.props.title = request.update.title
    }

    const { draftStep, status } = campaign.props
    if (request.update.summary) {
        if (status !== 'draft' || draftStep !== 'strategy') {
            throw new BadRequestError('Summary cannot be edited.')
        }
        campaign.props.summary = request.update.summary
    }

    if (request.update.strategy) {
        if (status !== 'draft' || draftStep !== 'strategy') {
            throw new BadRequestError('Strategy cannot be edited.')
        }
        campaign.props.strategy = request.update.strategy
    }

    // if (request.update.segmentId !== undefined) {
    //     if (status !== 'draft' || draftStep !== 'strategy') {
    //         throw new BadRequestError('Segment cannot be edited.')
    //     }
    //     campaign.props.segmentId = request.update.segmentId
    // }

    await campaignRepository.save(campaign)
}
