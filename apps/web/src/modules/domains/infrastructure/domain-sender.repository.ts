import { db, DbTransaction } from '@/db'
import { domains, domainSenders } from '@/db/schema'
import { domainSenderAdapters } from '@/modules/domains/domain-sender.adapter'
import { DomainSenderEntity } from '@/modules/domains/domain/domain-sender.entity'
import { DomainEntity } from '@/modules/domains/domain/domain.entity'
import { domainsAdapter } from '@/modules/domains/domains.adapter'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { and, eq } from 'drizzle-orm'

export const domainSenderRepository = {
    findById: async (
        senderId: string,
        tx?: DbTransaction
    ): Promise<DomainSenderEntity | null> => {
        const invoker = tx || db

        const [result] = await invoker
            .select()
            .from(domainSenders)
            .where(eq(domainSenders.id, senderId))

        if (!result) {
            return null
        }

        return domainSenderAdapters.dbToEntity(result)
    },

    findByOrganisation: async (
        organisationId: string,
        tx?: DbTransaction
    ): Promise<{ domain: DomainEntity; sender: DomainSenderEntity }[]> => {
        const invoker = tx || db

        const results = await invoker
            .select()
            .from(domainSenders)
            .where(eq(domainSenders.organisationId, organisationId))
            .innerJoin(domains, eq(domains.id, domainSenders.domainId))

        return results.map((result) => {
            return {
                domain: domainsAdapter.dbToEntity(result.domains),
                sender: domainSenderAdapters.dbToEntity(result.domain_senders),
            }
        })
    },

    findByDomain: async (
        domainId: string,
        organisationId: string,
        tx?: DbTransaction
    ): Promise<{ domain: DomainEntity; sender: DomainSenderEntity }[]> => {
        const invoker = tx || db

        const results = await invoker
            .select()
            .from(domainSenders)
            .where(
                and(
                    eq(domainSenders.domainId, domainId),
                    eq(domainSenders.organisationId, organisationId)
                )
            )
            .innerJoin(domains, eq(domains.id, domainSenders.domainId))

        return results.map((result) => {
            return {
                domain: domainsAdapter.dbToEntity(result.domains),
                sender: domainSenderAdapters.dbToEntity(result.domain_senders),
            }
        })
    },

    save: async (domainSender: DomainSenderEntity, tx?: DbTransaction) => {
        const invoker = tx || db

        const [result] = await invoker
            .insert(domainSenders)
            .values([domainSenderAdapters.entityToDb(domainSender)])
            .onConflictDoUpdate({
                target: domainSenders.id,
                set: buildConflictUpdateExcludeColumns(domainSenders, [
                    'id',
                    'domainId',
                    'organisationId',
                    'createdAt',
                ]),
            })
            .returning({ id: domainSenders.id })

        if (!result) {
            throw new Error('Failed to save domain sender.')
        }
    },
}
