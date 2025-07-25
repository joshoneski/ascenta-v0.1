import { estimateCampaignPriceUseCase } from '@/modules/campaigns/application/use-cases/estimate-campaign-price.use-case'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { CampaignPriceEstimateDTO } from '@/shared/dtos/campaign-price-estimate.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

export type EstimateCampaignPriceRequest = {
    campaignId: string
    organisationId: string
    user: UserDTO
}

export type EstimateCampaignPriceResponse = CampaignPriceEstimateDTO

export async function estimateCampaignPriceController(
    request: EstimateCampaignPriceRequest
): Promise<EstimateCampaignPriceResponse> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const estimate = await estimateCampaignPriceUseCase(
        request.campaignId,
        organisation.id,
        request.user
    )

    return {
        ...estimate,
        formattedPrice: `$${estimate.totalPriceDollars.toFixed(2)}`,
    }
}