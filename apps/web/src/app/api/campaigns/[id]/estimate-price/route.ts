import { estimateCampaignPriceController } from '@/modules/campaigns/application/controllers/estimate-campaign-price.controller'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { CampaignPriceEstimateApiResponse } from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'

export const GET = apiRoute<
    CampaignPriceEstimateApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { getUserOrThrow, getOrganisationIdOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const result = await estimateCampaignPriceController({
        campaignId: id,
        organisationId,
        user,
    })

    return NextResponse.json(result)
})