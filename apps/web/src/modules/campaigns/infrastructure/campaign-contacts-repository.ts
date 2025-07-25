import { db, DbTransaction } from '@/db'
import { campaignContacts, enrichedContactsView } from '@/db/schema'
import { campaignContactAdapters } from '@/modules/campaigns/campaign-contacts.adapter'
import { CampaignContactEntity } from '@/modules/campaigns/domain/campaign-contact.entity'
import { buildSegmentDbFilters } from '@/server/segments/common/filters'
import { segmentReadRepository } from '@/server/segments/segment-read-repository'
import { and, count, eq } from 'drizzle-orm'

export const campaignContactsRepository = {
    getAllContactIds: async (
        organisationId: string,
        tx?: DbTransaction
    ): Promise<string[]> => {
        const invoker = tx || db

        const contacts = await invoker
            .select({ id: enrichedContactsView.id })
            .from(enrichedContactsView)
            .where(eq(enrichedContactsView.organisationId, organisationId))

        return contacts.map((c) => c.id)
    },

    getSegmentContactIds: async (
        segmentId: string,
        organisationId: string,
        tx?: DbTransaction
    ): Promise<string[]> => {
        const invoker = tx || db

        const filters = await segmentReadRepository.getSegmentFilters(segmentId)
        const dbFilters = buildSegmentDbFilters(filters)

        const contacts = await invoker
            .select({ id: enrichedContactsView.id })
            .from(enrichedContactsView)
            .where(
                and(
                    eq(enrichedContactsView.organisationId, organisationId),
                    ...dbFilters
                )
            )

        return contacts.map((c) => c.id)
    },

    saveMany: async (
        contacts: CampaignContactEntity[],
        tx?: DbTransaction
    ): Promise<void> => {
        const invoker = tx || db

        if (contacts.length === 0) {
            return
        }

        await invoker
            .insert(campaignContacts)
            .values(contacts.map(campaignContactAdapters.entityToDb))
        // .onConflictDoUpdate({
        //     target: campaignContacts.id,
        //     set: buildConflictUpdateExcludeColumns(campaignContacts, [
        //         'id',
        //         'campaignId',
        //         'contactId',
        //         'organisationId',
        //         'createdAt',
        //     ]),
        // })
    },

    getCampaignContactCount: async (campaignId: string): Promise<number> => {
        const [result] = await db
            .select({ count: count() })
            .from(campaignContacts)
            .where(eq(campaignContacts.campaignId, campaignId))

        return result?.count ?? 0
    },
}
