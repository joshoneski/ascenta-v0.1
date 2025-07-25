import { db, DbTransaction } from '@/db'
import { campaignEmailDeliveries, campaignEmails } from '@/db/schema'
import { RequestContext } from '@/server/_utils/request'
import { count, eq, sql } from 'drizzle-orm'

export async function markCampaignEmailAsCompletedIfNeededUseCase(
    ctx: RequestContext,
    campaignEmailId: string,
    tx: DbTransaction | null
) {
    const invoker = tx || db

    const [result] = await invoker
        .select({
            total: count(campaignEmailDeliveries),
            failed: sql<number>`count(*) filter (where
            ${eq(campaignEmailDeliveries.status, 'failed')}
            )`.mapWith(Number),
            sent: sql<number>`count(*) filter (where
            ${eq(campaignEmailDeliveries.status, 'sent')}
            )`.mapWith(Number),
        })
        .from(campaignEmailDeliveries)
        .where(eq(campaignEmailDeliveries.campaignEmailId, campaignEmailId))

    if (!result) {
        return null
    }

    const isComplete = result.total === result.sent + result.failed
    if (isComplete) {
        const invoker = tx || db
        await invoker
            .update(campaignEmails)
            .set({ status: 'sent' })
            .where(eq(campaignEmails.id, campaignEmailId))
    }
}
