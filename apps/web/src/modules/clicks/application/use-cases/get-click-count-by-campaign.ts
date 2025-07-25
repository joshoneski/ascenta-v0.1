import { db } from '@/db'
import { clickEvents, clicks } from '@/db/schema'
import { checkCampaignAccess } from '@/modules/campaigns/campaign.access-control'
import { RequestContext } from '@/server/_utils/request'
import { count, eq, sql } from 'drizzle-orm'

export async function getClickCountByCampaign(
    ctx: RequestContext,
    request: { campaignId: string }
): Promise<number> {
    await checkCampaignAccess(ctx, request.campaignId)

    const [result] = await db
        .select({ count: count() })
        .from(clicks)
        .innerJoin(clickEvents, eq(clickEvents.clickId, clicks.id))
        .where(
            sql`${clicks.metadata}
            ->>'campaignId' =
            ${request.campaignId}`
        )

    return result?.count ?? 0
}
