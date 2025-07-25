import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import {
    CampaignLaunchRequest,
    CampaignLaunchResponse,
} from '@/modules/campaigns/campaigns.types'
import { campaignRepository } from '@/modules/campaigns/infrastructure/campaign-repository'
import { sendSlackSupportNotification } from '@/server/_lib/slack'
import { RequestContext } from '@/server/_utils/request'
import { checkAdminAccess } from '@/server/auth/use-cases/is-admin.use-case'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { ForbiddenError } from '@/shared/errors'

export async function launchCampaignController(
    ctx: RequestContext,
    request: CampaignLaunchRequest
): Promise<CampaignLaunchResponse> {
    if (!(await checkAdminAccess(ctx.actor.id))) {
        await sendSlackSupportNotification(
            'Feature Access Denied',
            [
                'User tried to launch a campaign.',
                '',
                `User: ${ctx.actor.id}`,
                `Campaign: ${request.campaignId}`,
                `Organisation: ${ctx.organisation?.id}`,
            ].join('\n')
        )
        throw new ForbiddenError(
            'You do not have access to this feature. Please contact support@littlephil.org for assistance.'
        )
    }

    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const campaign = await getCampaignUseCase(
        request.campaignId,
        organisation.id.value,
        request.user
    )

    campaign.launch()
    await campaignRepository.save(campaign)
}
