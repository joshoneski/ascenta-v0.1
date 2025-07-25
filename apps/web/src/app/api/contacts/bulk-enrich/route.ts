import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { bulkEnrichContactController } from '@/server/contacts/controllers/bulk-enrich-contacts.controller'
import { ContactBulkEnrichResponse } from '@ascenta-plus/types'
import { NextResponse } from 'next/server'

export const POST = apiRoute<ContactBulkEnrichResponse>(async (req, ctx) => {
    const {
        buildUserRequestContext,
        getUserOrThrow,
        getOrganisationIdOrThrow,
    } = getApiAuth()
    const reqCtx = await buildUserRequestContext()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    await bulkEnrichContactController(reqCtx, {
        organisationId,
        user,
    })

    return NextResponse.json({ success: true })
})
