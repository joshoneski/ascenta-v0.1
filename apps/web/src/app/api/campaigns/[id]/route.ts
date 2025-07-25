import { updateCampaignController } from '@/modules/campaigns/application/controllers/update-campaign.controller'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import {
    CampaignUpdateApiRequestBody,
    CampaignUpdateApiResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const patchSchema: z.Schema<CampaignUpdateApiRequestBody> = z.object({
    title: z.string().optional(),
    strategy: z.string().optional(),
    summary: z.string().optional(),
})

export const PATCH = apiRoute<
    CampaignUpdateApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { getUserOrThrow, getOrganisationIdOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = patchSchema.parse(unsafeBody)

    await updateCampaignController({
        update: body,
        campaignId: id,
        organisationId,
        user,
    })

    return NextResponse.json({ success: true })
})
