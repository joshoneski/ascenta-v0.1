import { getDomainUseCase } from '@/modules/domains/application/use-cases/get-domain.use-case'
import { resend } from '@/server/_lib/resend'
import {
    OrganisationDomainId,
    OrganisationEntity,
} from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function verifyDomainUseCase(
    domainId: OrganisationDomainId,
    organisation: OrganisationEntity,
    user: UserDTO
): Promise<void> {
    const domain = await getDomainUseCase(organisation, user)
    if (!domain) {
        throw new Error('Domain not found.')
    } else if (domain.id.value !== domainId.value) {
        throw new Error('You do not have access to this domain.')
    }

    const resendDomain = await resend.domains.verify(domain.resendDomainId)
    if (resendDomain.error) {
        // TODO: custom error
        throw resendDomain.error
    } else if (!resendDomain.data) {
        throw new Error('Failed to create domain.') // ?
    }
}
