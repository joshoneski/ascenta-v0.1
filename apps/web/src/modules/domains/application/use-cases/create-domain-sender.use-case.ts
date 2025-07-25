import { DomainSenderName } from '@/modules/domains/domain/domain-sender-name'
import { DomainSenderUsername } from '@/modules/domains/domain/domain-sender-username'
import { DomainSenderEntity } from '@/modules/domains/domain/domain-sender.entity'
import { DomainEntity } from '@/modules/domains/domain/domain.entity'
import { domainSenderRepository } from '@/modules/domains/infrastructure/domain-sender.repository'
import { RequestContext } from '@/server/_utils/request'
import { v4 as uuidv4 } from 'uuid'

export async function createDomainSenderUseCase(
    ctx: RequestContext,
    params: {
        domain: DomainEntity
        sender: {
            name: DomainSenderName
            username: DomainSenderUsername
        }
    }
): Promise<DomainSenderEntity> {
    const sender = new DomainSenderEntity({
        id: uuidv4(),
        domainId: params.domain.id.value,
        organisationId: params.domain.organisationId.value,
        name: params.sender.name.value,
        username: params.sender.username.value,
        createdAt: new Date(),
    })

    await domainSenderRepository.save(sender)

    return sender
}
