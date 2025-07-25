import { db } from '@/db'
import { campaigns } from '@/db/schema'
import { RequestContext } from '@/server/_utils/request'
import { NotFoundError } from '@/shared/errors'
import { and, eq } from 'drizzle-orm'

export async function checkCampaignAccess(
    ctx: RequestContext,
    campaignId: string
): Promise<void> {
    if (ctx.actor.type === 'system') {
        return
    } else if (!ctx.organisation) {
        throw new NotFoundError('Campaign access denied.')
    }

    const [campaign] = await db
        .select()
        .from(campaigns)
        .where(
            and(
                eq(campaigns.id, campaignId),
                eq(campaigns.organisationId, ctx.organisation.id)
            )
        )

    if (!campaign) {
        throw new NotFoundError('Campaign access denied.')
    }
}
