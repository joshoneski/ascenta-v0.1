import { contactsReadRepo } from '@/server/contacts/contact-read-repository'
import { ContactId } from '@/server/contacts/contact.entity'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { ContactEnrichmentDetailsDTO } from '@/shared/dtos/contact.dto'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError } from '@/shared/errors'

export async function getContactEnrichmentDetailsController(
    contactId: string,
    organisationId: string,
    user: UserDTO
): Promise<ContactEnrichmentDetailsDTO | null> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const contact = await contactsReadRepo.getContactEnrichmentDetails(
        new ContactId(contactId)
    )
    if (!contact) {
        return null
    } else if (contact.organisation !== organisation.id.value) {
        throw new ForbiddenError('You do not have access to this contact.')
    }

    return contact
}
