import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { createSegmentController } from '@/server/segments/controllers/create-segment.controller'
import {
    SegmentCreateRequestBody,
    SegmentCreateResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const postSchema: z.Schema<SegmentCreateRequestBody> = z.object({
    name: z.string().min(1),
    filters: z.array(
        z.object({
            field: z.string().min(1),
            operator: z.string().min(1),
            value: z.custom<Required<unknown>>((v) => v !== null),
        })
    ),
})

export const POST = apiRoute<SegmentCreateResponse>(async (req) => {
    const { getUserOrThrow, getOrganisationIdOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = postSchema.parse(unsafeBody)

    console.log(organisationId)

    const organisation = await createSegmentController(
        body,
        organisationId,
        user
    )

    return NextResponse.json(organisation)
})
