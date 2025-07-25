import { DomainSenderEntity } from '@/modules/domains/domain/domain-sender.entity'
import { DomainEntity } from '@/modules/domains/domain/domain.entity'
import { domainSenderRepository } from '@/modules/domains/infrastructure/domain-sender.repository'
import { RequestContext } from '@/server/_utils/request'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { ForbiddenError } from '@/shared/errors'

export async function getDomainSendersUseCase(
    ctx: RequestContext,
    organisationId: OrganisationId,
    domainId?: string
): Promise<{ domain: DomainEntity; sender: DomainSenderEntity }[]> {
    if (ctx.actor.type === 'system') {
        // allow all system actors
    } else if (ctx.organisation?.id !== organisationId.value) {
        throw new ForbiddenError('You do not have access to this organisation.')
    }

    if (domainId) {
        return domainSenderRepository.findByDomain(
            domainId,
            organisationId.value
        )
    }

    return domainSenderRepository.findByOrganisation(organisationId.value)
}
