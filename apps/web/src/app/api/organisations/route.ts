import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { createOrganisationController } from '@/server/organisations/controllers/create-organisation.controller'
import {
    OrganisationCreateRequestBody,
    OrganisationCreateResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inputSchema: z.Schema<OrganisationCreateRequestBody> = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
})

export const POST = apiRoute<OrganisationCreateResponse>(async (req) => {
    const { getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()

    const unsafeBody = await req.json()
    const body = inputSchema.parse(unsafeBody)

    const organisation = await createOrganisationController(
        {
            displayName: body.name,
            slug: body.slug,
        },
        user
    )

    return NextResponse.json(organisation)
})
