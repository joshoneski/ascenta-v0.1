import { completeCampaignContentController } from '@/modules/campaigns/application/controllers/complete-campaign-content.controller'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { CampaignCompleteContentApiResponse } from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'

export const POST = apiRoute<
    CampaignCompleteContentApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { getUserOrThrow, getOrganisationIdOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    await completeCampaignContentController({
        campaignId: id,
        organisationId,
        user,
    })

    return NextResponse.json({ success: true })
})