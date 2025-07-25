import { domainsService } from '@/modules/domains'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import {
    DomainCreateApiRequestBody,
    DomainCreateApiResponse,
    DomainListApiResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema: z.Schema<DomainCreateApiRequestBody> = z.object({
    domain: z.string(),
})

export const GET = apiRoute<DomainListApiResponse>(async (req) => {
    const { getOrganisationIdOrThrow, getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const domain = await domainsService.list({ organisationId, user })

    return NextResponse.json(domain)
})

export const POST = apiRoute<DomainCreateApiResponse>(async (req) => {
    const { getOrganisationIdOrThrow, getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = createSchema.parse(unsafeBody)

    const result = await domainsService.create({
        input: body,
        organisationId,
        user,
    })

    return NextResponse.json(result)
})
