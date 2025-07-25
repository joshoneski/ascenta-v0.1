import { isAdmin } from '@/server/auth/use-cases/is-admin.use-case'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError } from '@/shared/errors'

export async function getOrganisationMembersUseCase(
    organisation: OrganisationEntity,
    user: UserDTO
) {
    // TODO: check that user is an admin or admin of the organisation?
    if (!(await isAdmin(user))) {
        throw new ForbiddenError(
            'You do not have permission to access members for this organisation.'
        )
    }

    // TODO: skip and limit
    return organisationsRepo.query.findOrganisationMembers(organisation.id)
}
