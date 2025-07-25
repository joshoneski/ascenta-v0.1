import { countCampaignContactsUseCase } from '@/modules/campaigns/application/use-cases/count-campaign-contacts.use-case'
import { countCampaignEmailsSentUseCase } from '@/modules/campaigns/application/use-cases/count-campaign-emails-sent.use-case'
import {
    CampaignListRequest,
    CampaignListResult,
} from '@/modules/campaigns/campaigns.types'
import { campaignReadRepository } from '@/modules/campaigns/infrastructure/campaign-read-repository'
import { getClickCountByCampaign } from '@/modules/clicks/application/use-cases/get-click-count-by-campaign'
import { RequestContext } from '@/server/_utils/request'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'

const PAGE_SIZE = 10

export async function getCampaignsController(
    ctx: RequestContext,
    request: CampaignListRequest
): Promise<CampaignListResult> {
    const page = Math.max(1, request.page ?? 1)

    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const [campaigns, count] = await Promise.all([
        campaignReadRepository.getCampaignList({
            filter: {
                organisationId: organisation.id,
            },
            skip: (page - 1) * PAGE_SIZE, // Note: pages start at 1 and not 0
            limit: PAGE_SIZE,
        }),
        campaignReadRepository.getCampaignCount({
            filter: {
                organisationId: organisation.id,
            },
        }),
    ])

    const populatedCampaigns = await Promise.all(
        campaigns.map(async (campaign) => {
            const [contactCount, emailsSent, clickCount] = await Promise.all([
                countCampaignContactsUseCase(
                    campaign.props.id,
                    organisation.id,
                    request.user
                ),
                countCampaignEmailsSentUseCase(
                    campaign.props.id,
                    organisation.id,
                    request.user
                ),
                getClickCountByCampaign(ctx, { campaignId: campaign.props.id }),
            ])

            return {
                id: campaign.props.id,
                createdAt: campaign.props.createdAt.getTime(),
                clickCount,
                contactCount,
                emailsSent,
                title: campaign.props.title,
                status: campaign.props.status,
            }
        })
    )

    return {
        campaigns: populatedCampaigns,
        meta: {
            totalItems: count,
            page,
            pageCount: Math.ceil(count / PAGE_SIZE),
            pageSize: PAGE_SIZE,
        },
    }
}
