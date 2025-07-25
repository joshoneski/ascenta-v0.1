import { getDomainSendersUseCase } from '@/modules/domains/application/use-cases/get-domain-senders.use-case'
import {
    GetDomainSendersRequest,
    GetDomainSendersResponse,
} from '@/modules/domains/domain-senders.types'
import { RequestContext } from '@/server/_utils/request'
import { OrganisationId } from '@/server/organisations/organisation.entity'

export async function getDomainSendersController(
    ctx: RequestContext,
    request: GetDomainSendersRequest
): Promise<GetDomainSendersResponse> {
    const organisationId = new OrganisationId(request.organisationId)

    const senders = await getDomainSendersUseCase(
        ctx,
        organisationId,
        request.domainId
    )

    return {
        senders: senders.map(({ domain, sender }) => ({
            id: sender.props.id,
            email: sender.props.username + '@' + domain.domain,
            name: sender.props.name,
        })),
    }
}
