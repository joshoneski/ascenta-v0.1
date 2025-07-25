import { improveCampaignEmailSampleController } from '@/modules/campaigns/application/controllers/improve-campaign-email-sample.controller'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import {
    CampaignEmailImproveApiRequestBody,
    CampaignEmailImproveApiResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const postSchema: z.Schema<CampaignEmailImproveApiRequestBody> = z.object({
    improvements: z.string(),
})

export const POST = apiRoute<
    CampaignEmailImproveApiResponse,
    { params: Promise<{ id: string; emailId: string }> }
>(async (req, ctx) => {
    const { emailId } = await ctx.params

    const {
        buildUserRequestContext,
        getUserOrThrow,
        getOrganisationIdOrThrow,
    } = getApiAuth()
    const requestCtx = await buildUserRequestContext()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = postSchema.parse(unsafeBody)

    const result = await improveCampaignEmailSampleController(requestCtx, {
        id: emailId,
        improvements: body.improvements,
        organisationId,
        user,
    })

    return NextResponse.json(result)
})
