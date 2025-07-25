import { db } from '@/db'
import { domains } from '@/db/schema'
import { getDomainUseCase } from '@/modules/domains/application/use-cases/get-domain.use-case'
import { DomainEntity } from '@/modules/domains/domain/domain.entity'
import { domainsAdapter } from '@/modules/domains/domains.adapter'
import { resend } from '@/server/_lib/resend'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function createDomainUseCase(
    params: { domain: string },
    organisation: OrganisationEntity,
    user: UserDTO
): Promise<DomainEntity> {
    const domain = await getDomainUseCase(organisation, user)
    if (domain) {
        throw new Error('Organisations can only have 1 domain.')
    }

    const resendDomain = await resend.domains.create({
        name: params.domain,
    })
    if (resendDomain.error) {
        // TODO: custom error
        throw resendDomain.error
    } else if (!resendDomain.data) {
        throw new Error('Failed to create domain.') // ?
    }

    const [result] = await db
        .insert(domains)
        .values({
            domain: params.domain,
            resendDomainId: resendDomain.data.id,
            organisationId: organisation.id.value,
        })
        .returning()
    if (!result) {
        throw new Error('Failed to create domain')
    }

    return domainsAdapter.dbToEntity(result)
}
