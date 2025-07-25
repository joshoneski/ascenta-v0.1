import { domainsService } from '@/modules/domains'
import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { DomainVerifyApiResponse } from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'

export const POST = apiRoute<
    DomainVerifyApiResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { getOrganisationIdOrThrow, getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    await domainsService.verify({
        domainId: id,
        organisationId,
        user,
    })

    return NextResponse.json({ success: true })
})
