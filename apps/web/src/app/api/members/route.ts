import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { listOrganisationMembersController } from '@/server/organisations/controllers/list-organisation-members.controller'
import { OrganisationMembersResponse } from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'

export const GET = apiRoute<OrganisationMembersResponse>(async (req) => {
    const { getOrganisationIdOrThrow, getUserOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const result = await listOrganisationMembersController(organisationId, user)

    return NextResponse.json(result)
})
