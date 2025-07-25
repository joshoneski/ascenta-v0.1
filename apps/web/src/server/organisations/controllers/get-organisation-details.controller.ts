import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { OrganisationRetrieveResponse } from '@ascenta-plus/types'

export async function getOrganisationDetailsController(
    organisationId: string,
    user: UserDTO
): Promise<OrganisationRetrieveResponse> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    return {
        displayName: organisation.displayName,
        slug: organisation.slug,
        primaryColor: organisation.primaryColor,
    }
}
