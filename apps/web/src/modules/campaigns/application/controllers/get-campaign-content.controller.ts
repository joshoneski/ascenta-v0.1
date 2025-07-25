import { db } from '@/db'
import { campaignEmails } from '@/db/schema'
import {
    CampaignContentRequest,
    CampaignContentResult,
} from '@/modules/campaigns'
import { millisecondsToDays } from '@/modules/campaigns/application/common/time'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { asc, eq } from 'drizzle-orm'

export async function getCampaignContentController(
    request: CampaignContentRequest
): Promise<CampaignContentResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const campaign = await getCampaignUseCase(
        request.id,
        organisation.id.value,
        request.user
    )

    const emails = await db
        .select()
        .from(campaignEmails)
        .where(eq(campaignEmails.campaignId, campaign.props.id))
        .orderBy(asc(campaignEmails.startOffsetMs))

    return {
        emails: emails.map((email) => {
            return {
                id: email.id,
                day: millisecondsToDays(email.startOffsetMs) + 1,
                sample: email.sample,
                subject: email.subject,
            }
        }),
    }
}
