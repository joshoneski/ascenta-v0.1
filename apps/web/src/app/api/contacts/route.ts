import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { createContactController } from '@/server/contacts/controllers/create-contact.controller'
import {
    ContactCreateRequestBody,
    ContactCreateResponse,
} from '@ascenta-plus/types/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inputSchema: z.Schema<ContactCreateRequestBody> = z.object({
    email: z.string().email(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
})

export const POST = apiRoute<ContactCreateResponse>(async (req) => {
    const { buildUserRequestContext, getOrganisationIdOrThrow } = getApiAuth()
    const reqCtx = await buildUserRequestContext()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeBody = await req.json()
    const body = inputSchema.parse(unsafeBody)

    const contact = await createContactController(reqCtx, {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        organisationId,
    })

    return NextResponse.json(contact)
})
