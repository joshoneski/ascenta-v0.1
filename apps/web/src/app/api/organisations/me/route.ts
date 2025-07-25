import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { getOrganisationDetailsController } from '@/server/organisations/controllers/get-organisation-details.controller'
import { updateOrganisationDetailsController } from '@/server/organisations/controllers/update-organisation-details.controller'
import { hexRegex } from '@/shared/regex'
import {
    OrganisationUpdateRequestBody,
    OrganisationUpdateResponse,
} from '@ascenta-plus/types/lib/api'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema: z.Schema<OrganisationUpdateRequestBody> = z.object({
    displayName: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    primaryColor: z.string().regex(hexRegex).optional(),
})

export const GET = apiRoute(async (req) => {
    const { getOrganisationIdOrThrow, getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const organisation = await getOrganisationDetailsController(
        organisationId,
        user
    )

    return NextResponse.json(organisation)
})

export const PATCH = apiRoute<OrganisationUpdateResponse>(async (req) => {
    const { getOrganisationIdOrThrow, getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = updateSchema.parse(unsafeBody)

    const result = await updateOrganisationDetailsController(
        body,
        organisationId,
        user
    )

    return NextResponse.json(result)
})
