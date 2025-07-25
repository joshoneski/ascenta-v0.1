import { CampaignMetadataDTO } from '@/shared/dtos/campaign.dto'
import { routes } from '@/shared/routes'
import { redirect } from 'next/navigation'

export const redirectToCampaignStep = (
    orgSlug: string,
    campaignId: string,
    metadata: CampaignMetadataDTO
) => {
    if (metadata.status !== 'draft') {
        redirect(routes.dashboard.campaigns.view(orgSlug, campaignId))
    }

    switch (metadata.draftStep) {
        case 'content':
            return redirect(
                routes.dashboard.campaigns.draft.comms(orgSlug, campaignId)
            )
        case 'goals':
            return redirect(routes.dashboard.campaigns.create(orgSlug))
        case 'review':
            return redirect(
                routes.dashboard.campaigns.view(orgSlug, campaignId)
            )
        case 'strategy':
            return redirect(
                routes.dashboard.campaigns.draft.strategy(orgSlug, campaignId)
            )
    }
}
