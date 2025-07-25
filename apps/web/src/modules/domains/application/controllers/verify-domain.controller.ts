import { DomainVerifyRequest, DomainVerifyResult } from '@/modules/domains'
import { verifyDomainUseCase } from '@/modules/domains/application/use-cases/verify-domain.use-case'
import { OrganisationDomainId } from '@/server/organisations/organisation.entity'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'

export async function verifyDomainController(
    request: DomainVerifyRequest
): Promise<DomainVerifyResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    await verifyDomainUseCase(
        new OrganisationDomainId(request.domainId),
        organisation,
        request.user
    )
}
