import { domains } from '@/db/schema'
import { DomainEntity, DomainId } from '@/modules/domains/domain/domain.entity'
import { OrganisationId } from '@/server/organisations/organisation.entity'

export const domainsAdapter = {
    dbToEntity: (domain: typeof domains.$inferSelect): DomainEntity =>
        new DomainEntity(
            new DomainId(domain.id),
            new OrganisationId(domain.organisationId),
            domain.domain,
            domain.resendDomainId,
            domain.createdAt
        ),

    entityToDb: (domain: DomainEntity): typeof domains.$inferSelect => ({
        id: domain.id.value,
        createdAt: domain.createdAt,
        domain: domain.domain,
        organisationId: domain.organisationId.value,
        resendDomainId: domain.resendDomainId,
    }),
}
