import { isAdmin as _isAdmin } from '@/server/auth/use-cases/is-admin.use-case'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { getUserOrganisationsUseCase } from '@/server/users/use-cases/get-user-organisations.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError } from '@/shared/errors'

export async function getOrganisationBySlugUseCase(
    slug: string,
    user: UserDTO
) {
    const organisation = await organisationsRepo.query.findBySlug(slug)

    const userOrganisations = await getUserOrganisationsUseCase(user)
    const isOrganisationMember = userOrganisations.some(
        (userOrganisation) => userOrganisation.slug === organisation.slug
    )

    if (isOrganisationMember) {
        return organisation
    }

    const isAdmin = await _isAdmin(user)
    if (isAdmin) {
        return organisation
    }

    throw new ForbiddenError(
        'You do not have permission to access this organisation.'
    )
}
