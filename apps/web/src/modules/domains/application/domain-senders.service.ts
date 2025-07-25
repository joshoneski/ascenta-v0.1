import { getDomainSendersController } from '@/modules/domains/application/controllers/get-domain-senders.controller'
import { GetDomainSendersRequest } from '@/modules/domains/domain-senders.types'
import { RequestContext } from '@/server/_utils/request'

class DomainSendersService {
    list(ctx: RequestContext, request: GetDomainSendersRequest) {
        return getDomainSendersController(ctx, request)
    }
}

export const domainSendersService = new DomainSendersService()
