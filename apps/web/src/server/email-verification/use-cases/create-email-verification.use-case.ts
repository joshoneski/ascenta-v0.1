import { isAdmin } from '@/server/auth/use-cases/is-admin.use-case'
import { ContactEntity } from '@/server/contacts/contact.entity'
import { emailVerificationsRepo } from '@/server/email-verification/email-verification.repository'
import {
    EmailVerificationCheckResult,
    EmailVerificationStatus,
} from '@/server/email-verification/email-verification.types'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError } from '@/shared/errors'

export async function createEmailVerificationUseCase(
    input: {
        email: string
        status: EmailVerificationStatus
        blacklisted: EmailVerificationCheckResult
        deliverable: EmailVerificationCheckResult
        disposable: EmailVerificationCheckResult
        roleBased: EmailVerificationCheckResult
        syntax: EmailVerificationCheckResult
    },
    contact: ContactEntity,
    organisation: OrganisationEntity,
    user: UserDTO
) {
    // TODO: check user belongs to org
    if (!(await isAdmin(user))) {
        throw new ForbiddenError(
            'You do not have access to create contacts for this organisation.'
        )
    }

    return emailVerificationsRepo.mutate.create({
        email: input.email,
        status: input.status,
        blacklisted: input.blacklisted,
        deliverable: input.deliverable,
        disposable: input.disposable,
        roleBased: input.roleBased,
        syntax: input.syntax,
    })
}
