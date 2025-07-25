import { UpdateOrganisationParams } from '@/server/organisations/organisation.types'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { updateOrganisationDetailsUseCase } from '@/server/organisations/use-cases/update-organisation-details.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { OrganisationUpdateResponse } from '@ascenta-plus/types'

export async function updateOrganisationDetailsController(
    input: UpdateOrganisationParams,
    organisationId: string,
    user: UserDTO
): Promise<OrganisationUpdateResponse> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    await updateOrganisationDetailsUseCase(organisation, input, user)

    return { success: true }
}
