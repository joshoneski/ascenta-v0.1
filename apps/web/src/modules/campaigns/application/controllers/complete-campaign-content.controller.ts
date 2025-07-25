import {
    CampaignCompleteContentRequest,
    CampaignCompleteContentResult,
} from '@/modules/campaigns'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { campaignRepository } from '@/modules/campaigns/infrastructure/campaign-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { BadRequestError } from '@/shared/errors'

export async function completeCampaignContentController(
    request: CampaignCompleteContentRequest
): Promise<CampaignCompleteContentResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const campaign = await getCampaignUseCase(
        request.campaignId,
        organisation.id.value,
        request.user
    )

    if (
        campaign.props.status !== 'draft' ||
        campaign.props.draftStep !== 'content'
    ) {
        throw new BadRequestError('Campaign content cannot be completed.')
    }

    campaign.props.draftStep = 'review'
    await campaignRepository.save(campaign)
}
