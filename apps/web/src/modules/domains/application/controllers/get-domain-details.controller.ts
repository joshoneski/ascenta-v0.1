import { DomainListRequest, DomainListResult } from '@/modules/domains'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { getDomainDetailsUseCase } from '../use-cases/get-domain-details.use-case'

export async function getDomainDetailsController(
    request: DomainListRequest
): Promise<DomainListResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const domain = await getDomainDetailsUseCase(organisation, request.user)
    if (!domain) {
        return {
            domains: [],
            meta: {
                totalItems: 0,
                page: 1,
                pageCount: 1,
                pageSize: 1,
            },
        }
    }

    return {
        domains: [domain],
        meta: {
            totalItems: 1,
            page: 1,
            pageCount: 1,
            pageSize: 1,
        },
    }
}
