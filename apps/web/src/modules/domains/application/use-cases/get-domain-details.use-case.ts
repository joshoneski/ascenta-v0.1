import { db } from '@/db'
import { domains, domainSenders } from '@/db/schema'
import { DomainListItemDTO } from '@/modules/domains'
import { resend } from '@/server/_lib/resend'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { notEmpty } from '@/shared/arrays'
import { UserDTO } from '@/shared/dtos/user.dto'
import { eq } from 'drizzle-orm'

export async function getDomainDetailsUseCase(
    organisation: OrganisationEntity,
    user: UserDTO
): Promise<DomainListItemDTO | null> {
    const results = await db
        .select()
        .from(domains)
        .leftJoin(domainSenders, eq(domainSenders.domainId, domains.id))
        .where(eq(domains.organisationId, organisation.id.value))

    const domain = results.at(0)?.domains
    if (!domain) {
        return null
    }

    const { data, error } = await resend.domains.get(domain.resendDomainId)
    if (error) {
        // TODO: custom error
        throw error
    } else if (!data) {
        throw new Error('Domain not found.') // ?
    }

    const senders = results
        .map((result) => {
            const sender = result.domain_senders
            if (!sender) {
                return null
            }

            return {
                email: `${sender.username}@${data.name}`,
                name: sender.name,
            }
        })
        .filter(notEmpty)

    return {
        id: domain.id,
        domain: data.name,
        status: data.status,
        senders,
        records: data.records.map((record) => {
            return {
                record: record.record,
                name: record.name,
                ttl: record.ttl,
                type: record.type,
                status: record.status,
                value: record.value,
            }
        }),
    }
}
