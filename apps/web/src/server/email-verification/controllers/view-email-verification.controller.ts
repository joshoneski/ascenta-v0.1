import { contactAdapters } from '@/server/contacts/contact.adapter'
import { EnrichedContactEntity } from '@/server/contacts/contact.entity'
import { EmailVerificationEntity } from '@/server/email-verification/email-verification.entity'
import { countUnverifiedContactsUseCase } from '@/server/email-verification/use-cases/count-unverified-contacts.use-case'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { getEmailVerificationSampleContactsUseCase } from '../use-cases/get-email-verification-sample-contacts.use-case'

export async function viewEmailVerificationController(
    organisationId: string,
    user: UserDTO
): Promise<ReturnType<typeof presenter>> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const [sampleContacts, unverifiedCount] = await Promise.all([
        getEmailVerificationSampleContactsUseCase(organisation, user),
        countUnverifiedContactsUseCase(organisation, user),
    ])

    return presenter(sampleContacts, unverifiedCount)
}

function presenter(
    sampleContacts: {
        enrichedContact: EnrichedContactEntity
        emailVerification: EmailVerificationEntity | null
    }[],
    unverifiedCount: number
) {
    return {
        sampleContacts: sampleContacts.map(
            ({ enrichedContact, emailVerification }) => {
                return contactAdapters.entityToListDTO(
                    enrichedContact,
                    emailVerification
                )
            }
        ),
        unverifiedCount,
    }
}
