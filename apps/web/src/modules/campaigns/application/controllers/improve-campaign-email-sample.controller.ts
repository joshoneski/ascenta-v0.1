import {
    CampaignEmailImproveRequest,
    CampaignEmailImproveResult,
} from '@/modules/campaigns'
import { getCampaignEmailUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-email.use-case'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { improveCampaignEmailUseCase } from '@/modules/campaigns/application/use-cases/improve-campaign-email.use-case'
import { campaignEmailRepository } from '@/modules/campaigns/infrastructure/campaign-email-repository'
import { RequestContext } from '@/server/_utils/request'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'

export async function improveCampaignEmailSampleController(
    ctx: RequestContext,
    request: CampaignEmailImproveRequest
): Promise<CampaignEmailImproveResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const email = await getCampaignEmailUseCase(ctx, request.id)

    const campaign = await getCampaignUseCase(
        email.props.campaignId,
        organisation.id.value,
        request.user
    )

    const { sampleEmail } = await improveCampaignEmailUseCase(
        campaign,
        email,
        request.improvements
    )
    email.props.sample = sampleEmail

    await campaignEmailRepository.save(email)

    return { sample: sampleEmail }
}
