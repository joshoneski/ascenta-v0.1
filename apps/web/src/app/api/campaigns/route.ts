import { campaignsService } from '@/modules/campaigns'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import {
    CampaignCreateApiRequestBody,
    CampaignCreateApiResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inputSchema: z.Schema<CampaignCreateApiRequestBody> = z.object({
    brief: z.string().min(1, 'Please provide more details in your brief.'),
    ctaUrl: z.string().url(),
    segment: z.string().nullable().optional(),
    sender: z.string().min(1, 'Please provide a sender for this campaign.'),
})

export const POST = apiRoute<CampaignCreateApiResponse>(async (req) => {
    const {
        buildUserRequestContext,
        getUserOrThrow,
        getOrganisationIdOrThrow,
    } = getApiAuth()
    const reqCtx = await buildUserRequestContext()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = inputSchema.parse(unsafeBody)

    const result = await campaignsService.createCampaign(reqCtx, {
        brief: body.brief,
        ctaUrl: body.ctaUrl,
        segmentId: body.segment,
        senderId: body.sender,
        organisationId,
        user,
    })

    return NextResponse.json(result)
})
