import {
    DomainCreateRequest,
    DomainListRequest,
    DomainSenderCreateRequest,
    DomainVerifyRequest,
} from '@/modules/domains'
import { createDomainSenderController } from '@/modules/domains/application/controllers/create-domain-sender.controller'
import { RequestContext } from '@/server/_utils/request'
import { createDomainController } from './controllers/create-domain.controller'
import { getDomainDetailsController } from './controllers/get-domain-details.controller'
import { verifyDomainController } from './controllers/verify-domain.controller'

class DomainsService {
    create(request: DomainCreateRequest) {
        return createDomainController(request)
    }

    list(request: DomainListRequest) {
        return getDomainDetailsController(request)
    }

    verify(request: DomainVerifyRequest) {
        return verifyDomainController(request)
    }

    senders = {
        create(ctx: RequestContext, request: DomainSenderCreateRequest) {
            return createDomainSenderController(ctx, request)
        },
    }
}

export const domainsService = new DomainsService()
