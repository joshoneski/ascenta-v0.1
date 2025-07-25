import {
    DomainSenderCreateRequest,
    DomainSenderCreateResult,
} from '@/modules/domains'
import { createDomainSenderUseCase } from '@/modules/domains/application/use-cases/create-domain-sender.use-case'
import { getDomainEntityUseCase } from '@/modules/domains/application/use-cases/get-domain-entity.use-case'
import { DomainSenderName } from '@/modules/domains/domain/domain-sender-name'
import { DomainSenderUsername } from '@/modules/domains/domain/domain-sender-username'
import { DomainId } from '@/modules/domains/domain/domain.entity'
import { RequestContext } from '@/server/_utils/request'
import { NotFoundError } from '@/shared/errors'

export async function createDomainSenderController(
    ctx: RequestContext,
    request: DomainSenderCreateRequest
): Promise<DomainSenderCreateResult> {
    const domainId = new DomainId(request.domainId)
    const senderName = new DomainSenderName(request.senderName)
    const senderUsername = new DomainSenderUsername(request.senderUsername)

    const domain = await getDomainEntityUseCase(ctx, domainId)
    if (!domain) {
        throw new NotFoundError('Domain not found.')
    }

    const sender = await createDomainSenderUseCase(ctx, {
        domain,
        sender: {
            name: senderName,
            username: senderUsername,
        },
    })

    return {
        id: sender.props.id,
    }
}
