import { launchCampaignController } from '@/modules/campaigns/application/controllers/launch-campaign.controller'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { CampaignLaunchApiResponse } from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'

export const POST = apiRoute<
    CampaignLaunchApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const {
        buildUserRequestContext,
        getUserOrThrow,
        getOrganisationIdOrThrow,
    } = getApiAuth()
    const reqCtx = await buildUserRequestContext()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    await launchCampaignController(reqCtx, {
        campaignId: id,
        organisationId,
        user,
    })

    return NextResponse.json({ success: true })
})
