import { db, DbTransaction } from '@/db'
import { campaignEmails } from '@/db/schema'
import { campaignEmailAdapters } from '@/modules/campaigns/campaign-emails.adapter'
import { CampaignEmailEntity } from '@/modules/campaigns/domain/campaign-email.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { eq } from 'drizzle-orm'

export const campaignEmailRepository = {
    findById: async (id: string) => {
        const [email] = await db
            .select()
            .from(campaignEmails)
            .where(eq(campaignEmails.id, id))

        if (!email) {
            return null
        }

        return campaignEmailAdapters.dbToEntity(email)
    },

    save: async (email: CampaignEmailEntity, tx?: DbTransaction) => {
        return campaignEmailRepository.saveMany([email], tx)
    },

    saveMany: async (emails: CampaignEmailEntity[], tx?: DbTransaction) => {
        const invoker = tx || db

        await invoker
            .insert(campaignEmails)
            .values(emails.map(campaignEmailAdapters.entityToDb))
            .onConflictDoUpdate({
                target: campaignEmails.id,
                set: buildConflictUpdateExcludeColumns(campaignEmails, [
                    'id',
                    'campaignId',
                    'organisationId',
                    'createdAt',
                ]),
            })
    },

    findByCampaignId: async (campaignId: string): Promise<CampaignEmailEntity[]> => {
        const emails = await db
            .select()
            .from(campaignEmails)
            .where(eq(campaignEmails.campaignId, campaignId))

        return emails.map(campaignEmailAdapters.dbToEntity)
    },
}
