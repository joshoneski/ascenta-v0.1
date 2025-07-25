import { countCampaignContactsUseCase } from '@/modules/campaigns/application/use-cases/count-campaign-contacts.use-case'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { campaignEmailRepository } from '@/modules/campaigns/infrastructure/campaign-email-repository'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { SEND_EMAIL_PRICE_CENTS } from '@/shared/constants'
import { UserDTO } from '@/shared/dtos/user.dto'

export type CampaignPriceEstimate = {
    contactCount: number
    emailCount: number
    pricePerContactPerEmail: number
    totalPriceCents: number
    totalPriceDollars: number
}

export async function estimateCampaignPriceUseCase(
    campaignId: string,
    organisationId: OrganisationId,
    user: UserDTO
): Promise<CampaignPriceEstimate> {
    // Get campaign to verify access
    const campaign = await getCampaignUseCase(
        campaignId,
        organisationId.value,
        user
    )

    // Get contact count
    const contactCount = await countCampaignContactsUseCase(
        campaignId,
        organisationId,
        user
    )

    // Get email count for the campaign
    const emails = await campaignEmailRepository.findByCampaignId(
        campaign.props.id
    )
    const emailCount = emails.length

    // Calculate total price
    const totalPriceCents = contactCount * emailCount * SEND_EMAIL_PRICE_CENTS
    const totalPriceDollars = totalPriceCents / 100

    return {
        contactCount,
        emailCount,
        pricePerContactPerEmail: SEND_EMAIL_PRICE_CENTS,
        totalPriceCents,
        totalPriceDollars,
    }
}
