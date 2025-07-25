import { isAdmin } from '@/server/auth/use-cases/is-admin.use-case'
import { organisationAdapters } from '@/server/organisations/organisation.adapter'
import { createOrganisationUseCase } from '@/server/organisations/use-cases/create-organisation.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError } from '@/shared/errors'
import { OrganisationCreateResponse } from '@ascenta-plus/types'

export async function createOrganisationController(
    input: { displayName: string; slug: string },
    user: UserDTO
): Promise<OrganisationCreateResponse> {
    if (!(await isAdmin(user))) {
        // TODO: throw new ForbiddenError
        throw new ForbiddenError(
            'You do not have permission to create charities.'
        )
    }

    const organisation = await createOrganisationUseCase(input, user)

    return organisationAdapters.entityToDTO(organisation)
}
