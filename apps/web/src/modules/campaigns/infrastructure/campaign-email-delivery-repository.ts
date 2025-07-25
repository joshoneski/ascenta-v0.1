import { db, DbTransaction } from '@/db'
import { campaignEmailDeliveries, campaignEmails } from '@/db/schema'
import { campaignEmailDeliveryAdapters } from '@/modules/campaigns/campaign-delivery-emails.adapter'
import { CampaignEmailDeliveryEntity } from '@/modules/campaigns/domain/campaign-email-delivery.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { eq } from 'drizzle-orm'

export const campaignEmailDeliveryRepository = {
    findById: async (id: string) => {
        const [result] = await db
            .select()
            .from(campaignEmailDeliveries)
            .where(eq(campaignEmailDeliveries.id, id))

        if (!result) {
            return null
        }

        return campaignEmailDeliveryAdapters.dbToEntity(result)
    },

    save: async (entity: CampaignEmailDeliveryEntity, tx?: DbTransaction) => {
        return campaignEmailDeliveryRepository.saveMany([entity], tx)
    },

    saveMany: async (
        entities: CampaignEmailDeliveryEntity[],
        tx?: DbTransaction
    ) => {
        const invoker = tx || db

        await invoker
            .insert(campaignEmailDeliveries)
            .values(entities.map(campaignEmailDeliveryAdapters.entityToDb))
            .onConflictDoUpdate({
                target: campaignEmails.id,
                set: buildConflictUpdateExcludeColumns(
                    campaignEmailDeliveries,
                    [
                        'id',
                        'campaignId',
                        'campaignContactId',
                        'campaignEmailId',
                        'organisationId',
                        'createdAt',
                    ]
                ),
            })
    },

    findByCampaignEmailId: async (
        campaignEmailId: string
    ): Promise<CampaignEmailDeliveryEntity[]> => {
        const results = await db
            .select()
            .from(campaignEmailDeliveries)
            .where(eq(campaignEmailDeliveries.campaignEmailId, campaignEmailId))

        return results.map(campaignEmailDeliveryAdapters.dbToEntity)
    },
}
