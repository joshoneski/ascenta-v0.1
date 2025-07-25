import { db } from '@/db'
import { campaignEmailDeliveries } from '@/db/schema'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { NotFoundError } from '@/shared/errors'
import { and, count, eq } from 'drizzle-orm'

export async function countCampaignEmailsSentUseCase(
    campaignId: string,
    organisationId: OrganisationId,
    user: UserDTO
): Promise<number> {
    const [emailsSent] = await db
        .select({ count: count() })
        .from(campaignEmailDeliveries)
        .where(
            and(
                eq(campaignEmailDeliveries.campaignId, campaignId),
                eq(campaignEmailDeliveries.status, 'sent')
            )
        )

    if (!emailsSent) {
        throw new NotFoundError('Campaign not found')
    }

    return emailsSent.count
}
