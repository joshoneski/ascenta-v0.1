import { db } from '@/db'
import { domains } from '@/db/schema'
import { DomainEntity, DomainId } from '@/modules/domains/domain/domain.entity'
import { domainsAdapter } from '@/modules/domains/domains.adapter'
import { RequestContext } from '@/server/_utils/request'
import { ForbiddenError } from '@/shared/errors'
import { eq } from 'drizzle-orm'

export async function getDomainEntityUseCase(
    ctx: RequestContext,
    domainId: DomainId
): Promise<DomainEntity | null> {
    const [domain] = await db
        .select()
        .from(domains)
        .where(eq(domains.id, domainId.value))

    if (!domain) {
        return null
    }

    const entity = domainsAdapter.dbToEntity(domain)
    if (ctx.actor.type === 'system') {
        return entity
    }

    if (entity.organisationId.value !== ctx.organisation?.id) {
        throw new ForbiddenError('You do not have access to this domain.')
    }

    return entity
}
