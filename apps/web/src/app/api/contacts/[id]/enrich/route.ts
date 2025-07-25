import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { getContactEnrichmentDetailsController } from '@/server/contacts/controllers/get-contact-enrichment-details.controller'
import { enrichContactController } from '@/server/enrichment/controllers/enrich-contact.controller'
import { NotFoundError } from '@/shared/errors'
import { ContactEnrichResponse } from '@ascenta-plus/types'
import { NextResponse } from 'next/server'

export const POST = apiRoute<
    ContactEnrichResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const {
        buildUserRequestContext,
        getUserOrThrow,
        getOrganisationIdOrThrow,
    } = getApiAuth()
    const reqCtx = await buildUserRequestContext()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const contactEnrichmentDetails = await enrichContactController(
        reqCtx,
        id,
        organisationId,
        user
    )

    if (!contactEnrichmentDetails) {
        throw new NotFoundError('No enrichment data for this contact.')
    }

    return NextResponse.json(contactEnrichmentDetails)
})

export const GET = apiRoute<
    ContactEnrichResponse,
    { params: Promise<{ id: string }> }
>(async (req, ctx) => {
    const { id } = await ctx.params

    const { getUserOrThrow, getOrganisationIdOrThrow } = getApiAuth()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const contactEnrichmentDetails =
        await getContactEnrichmentDetailsController(id, organisationId, user)

    if (!contactEnrichmentDetails) {
        throw new NotFoundError('No enrichment data for this contact.')
    }

    return NextResponse.json(contactEnrichmentDetails)
})
