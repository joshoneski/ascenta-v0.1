import 'server-only'

import { RequestContext } from '@/server/_utils/request'
import { organisationAdapters } from '@/server/organisations/organisation.adapter'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { getOrganisationBySlugUseCase } from '@/server/organisations/use-cases/get-organisation-by-slug.use-case'
import { serverAuth } from '@/server/server-auth'
import { getUserOrganisationsUseCase } from '@/server/users/use-cases/get-user-organisations.use-case'
import { X_URL_PATHNAME_HEADER } from '@/shared/constants'
import { OrganisationDTO } from '@/shared/dtos/organisation.dto'
import { UserDTO } from '@/shared/dtos/user.dto'
import { routes } from '@/shared/routes'
import { getUrlPathnameParts } from '@/shared/url'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export function getPageAuth() {
    return {
        buildUserRequestContext,
        getUser,
        getUserOrRedirect,
        getOrganisation,
        getOrganisations,
    }
}

async function getUser(): Promise<UserDTO | null> {
    return serverAuth.getCurrentUser()
}

async function getUserOrRedirect(): Promise<UserDTO> {
    const user = await getUser()
    if (!user) {
        redirect(routes.login)
    }
    return user
}

async function getOrganisation(): Promise<OrganisationDTO & { temp: boolean }> {
    const user = await getUserOrRedirect()

    const slug = await getOrganisationSlugFromUrl()
    if (!slug) {
        redirect(routes.organisations)
    }

    let organisation: OrganisationDTO
    try {
        const entity = await getOrganisationBySlugUseCase(slug, user)
        organisation = organisationAdapters.entityToDTO(entity)
    } catch (e) {
        console.error(e)
        redirect(routes.organisations)
    }

    if (!organisation) {
        redirect(routes.organisations)
    }

    const organisations = await getOrganisations()
    const isPerm = organisations.some(
        (_organisation) => _organisation.id === organisation.id
    )

    return {
        ...organisation,
        temp: !isPerm,
    }
}

async function getOrganisations(): Promise<OrganisationDTO[]> {
    const user = await getUserOrRedirect()

    const organisations = await getUserOrganisationsUseCase(user)
    return organisations.map(organisationAdapters.entityToDTO)
}

async function getOrganisationSlugFromUrl() {
    const headerList = await headers()

    const pathname = headerList.get(X_URL_PATHNAME_HEADER)
    if (!pathname) {
        redirect(routes.organisations)
    }

    const parts = getUrlPathnameParts(pathname)
    return parts[0] ?? null
}

async function buildUserRequestContext(): Promise<RequestContext> {
    const user = await getUserOrRedirect()
    const org = await getOrganisation()
    const orgs = await organisationsRepo.query.findOrganisationsWithUser(
        user.id
    )

    return {
        actor: {
            id: user.id,
            orgIds: orgs.map((org) => org.id.value),
            type: 'user',
        },
        organisation: { id: org.id },
        requestId: crypto.randomUUID(),
        source: 'page',
    }
}
