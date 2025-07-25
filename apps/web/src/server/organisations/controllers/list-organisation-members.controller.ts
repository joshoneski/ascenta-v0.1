import { organisationsReadRepo } from '@/server/organisations/organisation-read-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { OrganisationMembersResponse } from '@ascenta-plus/types'

export async function listOrganisationMembersController(
    organisationId: string,
    user: UserDTO
): Promise<OrganisationMembersResponse> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const members = await organisationsReadRepo.getOrganisationMembers(
        organisation.id
    )

    return { members }
}
