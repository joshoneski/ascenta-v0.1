import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { UpdateOrganisationParams } from '@/server/organisations/organisation.types'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function updateOrganisationDetailsUseCase(
    organisation: OrganisationEntity,
    update: UpdateOrganisationParams,
    user: UserDTO
) {
    if (Object.keys(update).length === 0) {
        return
    }

    await organisationsRepo.mutate.update(organisation.id, update)
}
