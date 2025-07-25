import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function getUserOrganisationsUseCase(user: UserDTO) {
    return organisationsRepo.query.findOrganisationsWithUser(user.id)
}
