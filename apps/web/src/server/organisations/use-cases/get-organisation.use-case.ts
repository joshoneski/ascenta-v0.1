import { SYSTEM_USER } from '@/server/auth/get-system-auth'
import { checkAdminAccess } from '@/server/auth/use-cases/is-admin.use-case'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { getUserOrganisationsUseCase } from '@/server/users/use-cases/get-user-organisations.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function getOrganisationUseCase(id: string, user: UserDTO) {
    const organisation = await organisationsRepo.query.findById(
        new OrganisationId(id)
    )
    if (!organisation) {
        throw new NotFoundError('Organisation not found.')
    }

    if (user === SYSTEM_USER) {
        return organisation
    }

    const userOrganisations = await getUserOrganisationsUseCase(user)
    const isOrganisationMember = userOrganisations.some(
        (userOrganisation) =>
            userOrganisation.id.value === organisation.id.value
    )

    if (isOrganisationMember) {
        return organisation
    }

    const isAdmin = await checkAdminAccess(user.id)
    if (isAdmin) {
        return organisation
    }

    throw new ForbiddenError(
        'You do not have permission to access this organisation.'
    )
}
