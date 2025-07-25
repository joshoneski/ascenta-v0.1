import { DomainSenderEntity } from '@/modules/domains/domain/domain-sender.entity'
import { domainSenderRepository } from '@/modules/domains/infrastructure/domain-sender.repository'
import { RequestContext } from '@/server/_utils/request'

export async function getDomainSenderUseCase(
    ctx: RequestContext,
    domainSenderId: string
): Promise<DomainSenderEntity | null> {
    const sender = await domainSenderRepository.findById(domainSenderId)
    if (!sender) {
        return null
    }

    if (ctx.actor.type === 'system') {
        return sender
    }

    if (sender.props.organisationId !== ctx.organisation?.id) {
        throw new Error('You do not have access to this sender.')
    }

    return sender
}
