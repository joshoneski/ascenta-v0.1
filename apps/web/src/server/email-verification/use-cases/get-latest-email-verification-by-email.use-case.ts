import { emailVerificationsRepo } from '@/server/email-verification/email-verification.repository'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function getLatestEmailVerificationByEmailUseCase(
    email: string,
    organisation: OrganisationEntity,
    user: UserDTO
) {
    return emailVerificationsRepo.query.findLatestByEmail(email)
}
