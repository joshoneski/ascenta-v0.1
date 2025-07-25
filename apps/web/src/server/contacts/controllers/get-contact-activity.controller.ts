import { db } from '@/db'
import {
    campaignContacts,
    campaignEmailDeliveries,
    campaigns,
    enrichedContactsView,
} from '@/db/schema'
import { RequestContext } from '@/server/_utils/request'
import {
    ContactActivityRequest,
    ContactActivityResult,
} from '@/server/contacts/contact.types'
import { FatalError } from '@/shared/errors'
import { and, desc, eq, SQL } from 'drizzle-orm'

export async function getContactActivityController(
    ctx: RequestContext,
    request: ContactActivityRequest
): Promise<ContactActivityResult> {
    // const contact = await getContact

    if (ctx.actor.type !== 'system' && !ctx.organisation) {
        throw new FatalError('Request must contain an organisation.')
    }

    const filters: Array<SQL> = [eq(enrichedContactsView.id, request.contactId)]
    if (ctx.organisation) {
        filters.push(
            eq(enrichedContactsView.organisationId, ctx.organisation.id)
        )
    }

    const emailDeliveries = await db
        .select({
            id: campaignEmailDeliveries.id,
            campaignTitle: campaigns.title,
            error: campaignEmailDeliveries.error,
            html: campaignEmailDeliveries.html,
            status: campaignEmailDeliveries.status,
            statusUpdatedAt: campaignEmailDeliveries.statusUpdatedAt,
            subject: campaignEmailDeliveries.subject,
        })
        .from(campaignEmailDeliveries)
        .innerJoin(
            campaigns,
            eq(campaignEmailDeliveries.campaignId, campaigns.id)
        )
        .innerJoin(
            campaignContacts,
            eq(campaignEmailDeliveries.campaignContactId, campaignContacts.id)
        )
        .innerJoin(
            enrichedContactsView,
            eq(campaignContacts.contactId, enrichedContactsView.id)
        )
        .where(and(...filters))
        .orderBy(desc(campaignEmailDeliveries.statusUpdatedAt))
        .limit(10)

    return {
        data: emailDeliveries.map((data) => {
            return {
                type: 'email_delivery',
                data,
            }
        }),
    }
}
