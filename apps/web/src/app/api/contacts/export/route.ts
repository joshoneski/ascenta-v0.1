import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { exportOrganisationContactsCsvController } from '@/server/contacts/controllers/export-organisation-contacts.controller'
import { NextResponse } from 'next/server'

export const GET = apiRoute(async (req) => {
    const { getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()

    const organisationId = req.nextUrl.searchParams.get('organisation')
    if (!organisationId) {
        throw new Error('Missing organisation query param.')
    }

    const result = await exportOrganisationContactsCsvController(
        organisationId,
        user
    )

    return new NextResponse(result, {
        headers: {
            'Content-Type': 'text.csv',
            'Content-Disposition': `attachment; filename=contacts.csv`,
        },
    })
})
