import { db, DbTransaction } from '@/db'
import { domains } from '@/db/schema'
import { DomainEntity } from '@/modules/domains/domain/domain.entity'
import { domainsAdapter } from '@/modules/domains/domains.adapter'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { eq } from 'drizzle-orm'

export const domainRepository = {
    findById: async (id: string) => {
        const [domain] = await db
            .select()
            .from(domains)
            .where(eq(domains.id, id))

        if (!domain) {
            return null
        }

        return domainsAdapter.dbToEntity(domain)
    },

    save: async (domain: DomainEntity, tx?: DbTransaction) => {
        const invoker = tx || db

        const [result] = await invoker
            .insert(domains)
            .values([domainsAdapter.entityToDb(domain)])
            .onConflictDoUpdate({
                target: domains.id,
                set: buildConflictUpdateExcludeColumns(domains, [
                    'id',
                    'organisationId',
                    'createdAt',
                    'resendDomainId',
                ]),
            })
            .returning({ id: domains.id })

        if (!result) {
            throw new Error('Failed to save domain.')
        }
    },
}
