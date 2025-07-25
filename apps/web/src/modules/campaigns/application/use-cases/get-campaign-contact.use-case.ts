import { db } from '@/db'
import { campaignContacts } from '@/db/schema'
import { RequestContext } from '@/server/_utils/request'
import { ForbiddenError } from '@/shared/errors'
import { eq } from 'drizzle-orm'

export async function getCampaignContactUseCase(
    ctx: RequestContext,
    campaignContactId: string
) {
    const [result] = await db
        .select()
        .from(campaignContacts)
        .where(eq(campaignContacts.id, campaignContactId))

    if (!result) {
        return null
    }

    if (ctx.actor.type === 'system') {
        return result
    }

    if (result.organisationId !== ctx.organisation?.id) {
        throw new ForbiddenError('You do not have access to this contact.')
    }

    return result
}
