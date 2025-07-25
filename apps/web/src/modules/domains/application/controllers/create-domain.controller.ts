import { DomainCreateRequest, DomainCreateResult } from '@/modules/domains'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { createDomainUseCase } from '../use-cases/create-domain.use-case'

export async function createDomainController(
    request: DomainCreateRequest
): Promise<DomainCreateResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const domain = await createDomainUseCase(
        request.input,
        organisation,
        request.user
    )

    return {
        id: domain.id.value,
    }
}
