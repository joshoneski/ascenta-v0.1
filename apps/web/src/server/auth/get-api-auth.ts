import 'server-only'

import { RequestContext } from '@/server/_utils/request'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { serverAuth } from '@/server/server-auth'
import { X_ORGANISATION_HEADER } from '@/shared/constants'
import { UserDTO } from '@/shared/dtos/user.dto'
import {
    MissingOrganisationHeaderError,
    UnauthorisedError,
} from '@/shared/errors'
import { headers } from 'next/headers'

export function getApiAuth() {
    return {
        buildUserRequestContext,
        // TODO: make the below private
        getUser,
        getUserOrThrow,
        getOrganisationId,
        getOrganisationIdOrThrow,
    }
}

async function getUser(): Promise<UserDTO | null> {
    return serverAuth.getCurrentUser()
}

async function getUserOrThrow(): Promise<UserDTO> {
    const user = await getUser()
    if (!user) {
        throw new UnauthorisedError()
    }
    return user
}

async function getOrganisationId() {
    const headersList = await headers()
    return headersList.get(X_ORGANISATION_HEADER)
}

async function getOrganisationIdOrThrow(): Promise<string> {
    const organisationId = await getOrganisationId()
    if (!organisationId || organisationId === 'undefined') {
        throw new MissingOrganisationHeaderError()
    }

    return organisationId
}

async function buildUserRequestContext(): Promise<RequestContext> {
    const user = await getUserOrThrow()
    const orgId = await getOrganisationIdOrThrow()

    const org = await getOrganisationUseCase(orgId, user)
    const orgs = await organisationsRepo.query.findOrganisationsWithUser(
        user.id
    )

    return {
        actor: {
            id: user.id,
            orgIds: orgs.map((org) => org.id.value),
            type: 'user',
        },
        organisation: { id: org.id.value },
        requestId: crypto.randomUUID(),
        source: 'api',
    }
}
