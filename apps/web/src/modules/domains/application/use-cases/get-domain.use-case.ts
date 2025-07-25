import { db } from '@/db'
import { domains } from '@/db/schema'
import { domainsAdapter } from '@/modules/domains/domains.adapter'
import {
    OrganisationDomainEntity,
    OrganisationEntity,
} from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { eq } from 'drizzle-orm'

export async function getDomainUseCase(
    organisation: OrganisationEntity,
    user: UserDTO
): Promise<OrganisationDomainEntity | null> {
    const [domain] = await db
        .select()
        .from(domains)
        .where(eq(domains.organisationId, organisation.id.value))

    if (!domain) {
        return null
    }

    return domainsAdapter.dbToEntity(domain)
}
