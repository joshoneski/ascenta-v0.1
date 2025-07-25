import { domainsService } from '@/modules/domains'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import {
    DomainSenderCreateApiRequestBody,
    DomainSenderCreateApiResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const postSchema: z.Schema<DomainSenderCreateApiRequestBody> = z.object({
    senderName: z.string(),
    senderUsername: z.string(),
})

export const POST = apiRoute<
    DomainSenderCreateApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { buildUserRequestContext } = getApiAuth()
    const reqCtx = await buildUserRequestContext()

    const unsafeBody = await req.json()
    const body = postSchema.parse(unsafeBody)

    const result = await domainsService.senders.create(reqCtx, {
        domainId: id,
        senderName: body.senderName,
        senderUsername: body.senderUsername,
    })

    return NextResponse.json({ id: result.id })
})
