import { completeCampaignStrategyController } from '@/modules/campaigns/application/controllers/complete-campaign-strategy.controller'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { CampaignCompleteStrategyApiResponse } from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'

export const POST = apiRoute<
    CampaignCompleteStrategyApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { getUserOrThrow, getOrganisationIdOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    await completeCampaignStrategyController({
        campaignId: id,
        organisationId,
        user,
    })

    return NextResponse.json({ success: true })
})
