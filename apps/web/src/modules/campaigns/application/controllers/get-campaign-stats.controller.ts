import { countCampaignContactsUseCase } from '@/modules/campaigns/application/use-cases/count-campaign-contacts.use-case'
import { countCampaignEmailsSentUseCase } from '@/modules/campaigns/application/use-cases/count-campaign-emails-sent.use-case'
import {
    CampaignStatsRequest,
    CampaignStatsResult,
} from '@/modules/campaigns/campaigns.types'
import { getClickCountByCampaign } from '@/modules/clicks/application/use-cases/get-click-count-by-campaign'
import { RequestContext } from '@/server/_utils/request'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'

export async function getCampaignStatsController(
    ctx: RequestContext,
    request: CampaignStatsRequest
): Promise<CampaignStatsResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const [contactCount, emailsSent, clickCount] = await Promise.all([
        countCampaignContactsUseCase(request.id, organisation.id, request.user),
        countCampaignEmailsSentUseCase(
            request.id,
            organisation.id,
            request.user
        ),
        getClickCountByCampaign(ctx, { campaignId: request.id }),
    ])

    return {
        clickCount,
        contactCount,
        emailsSent,
    }
}
