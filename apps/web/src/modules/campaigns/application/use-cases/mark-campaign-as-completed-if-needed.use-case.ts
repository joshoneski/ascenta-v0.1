import { db, DbTransaction } from '@/db'
import { campaignEmails, campaigns } from '@/db/schema'
import { RequestContext } from '@/server/_utils/request'
import { count, eq, sql } from 'drizzle-orm'

export async function markCampaignAsCompletedIfNeededUseCase(
    ctx: RequestContext,
    campaignId: string,
    tx: DbTransaction | null
) {
    const invoker = tx || db

    const [result] = await invoker
        .select({
            totalEmails: count(campaignEmails),
            failedEmails: sql<number>`count(*) filter (where
            ${eq(campaignEmails.status, 'failed')}
            )`.mapWith(Number),
            sentEmails: sql<number>`count(*) filter (where
            ${eq(campaignEmails.status, 'sent')}
            )`.mapWith(Number),
        })
        .from(campaignEmails)
        .where(eq(campaignEmails.campaignId, campaignId))

    if (!result) {
        return null
    }

    const isComplete =
        result.totalEmails === result.sentEmails + result.failedEmails
    if (isComplete) {
        const invoker = tx || db
        await invoker
            .update(campaigns)
            .set({ status: 'finished' })
            .where(eq(campaigns.id, campaignId))
    }
}
