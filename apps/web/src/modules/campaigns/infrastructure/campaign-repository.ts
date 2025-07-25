import { db, DbTransaction } from '@/db'
import { campaigns } from '@/db/schema'
import { campaignsAdapters } from '@/modules/campaigns/campaigns.adapter'
import { CampaignEntity } from '@/modules/campaigns/domain/campaign.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { eq } from 'drizzle-orm'

export const campaignRepository = {
    findById: async (id: string) => {
        const [campaign] = await db
            .select()
            .from(campaigns)
            .where(eq(campaigns.id, id))

        if (!campaign) {
            return null
        }

        return campaignsAdapters.dbToEntity(campaign)
    },

    save: async (campaign: CampaignEntity, tx?: DbTransaction) => {
        const invoker = tx || db

        const [result] = await invoker
            .insert(campaigns)
            .values([campaignsAdapters.entityToDb(campaign)])
            .onConflictDoUpdate({
                target: campaigns.id,
                set: buildConflictUpdateExcludeColumns(campaigns, [
                    'id',
                    'organisationId',
                    'createdAt',
                ]),
            })
            .returning({ id: campaigns.id })

        if (!result) {
            throw new Error('Failed to save campaign.')
        }
    },
}
