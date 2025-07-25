import { isAdmin } from '@/server/auth/use-cases/is-admin.use-case'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { UserDTO } from '@/shared/dtos/user.dto'
import { BadRequestError, ForbiddenError } from '@/shared/errors'
import { isSlug } from '@/shared/slugs'

export async function createOrganisationUseCase(
    input: { displayName: string; slug: string },
    user: UserDTO
) {
    if (!(await isAdmin(user))) {
        throw new ForbiddenError(
            'You do not have permission to create charities.'
        )
    }

    if (!isSlug(input.slug)) {
        throw new BadRequestError(
            'Slug must only contain lowercase letters and hyphens.'
        )
    }

    return organisationsRepo.mutate.create({
        displayName: input.displayName,
        slug: input.slug,
        type: 'charity',
    })
}
