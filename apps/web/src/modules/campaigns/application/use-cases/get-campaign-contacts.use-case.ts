import { db } from '@/db'
import { campaignContacts } from '@/db/schema'
import { RequestContext } from '@/server/_utils/request'
import { eq } from 'drizzle-orm'

export async function getCampaignContactsUseCase(
    ctx: RequestContext,
    campaignId: string
) {
    return db
        .select({
            id: campaignContacts.id,
            contactId: campaignContacts.contactId,
        })
        .from(campaignContacts)
        .where(eq(campaignContacts.campaignId, campaignId))
}
