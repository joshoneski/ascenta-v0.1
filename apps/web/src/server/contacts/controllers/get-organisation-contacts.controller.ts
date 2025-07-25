import { contactsReadRepo } from '@/server/contacts/contact-read-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { ContactListItemDTO } from '@/shared/dtos/contact.dto'
import { PaginationMeta } from '@/shared/dtos/pagination.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

const PAGE_SIZE = 10

export async function getOrganisationContactsController(
    page: number,
    organisationId: string,
    user: UserDTO
): Promise<{ contacts: ContactListItemDTO[]; meta: PaginationMeta }> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const [contacts, count] = await Promise.all([
        contactsReadRepo.getContactList({
            filter: {
                organisationId: organisation.id,
            },
            skip: (page - 1) * PAGE_SIZE, // Note: pages start at 1 and not 0
            limit: PAGE_SIZE,
        }),
        contactsReadRepo.getContactCount(organisation.id),
    ])

    return {
        contacts,
        meta: {
            totalItems: count,
            page,
            pageCount: Math.ceil(count / PAGE_SIZE),
            pageSize: PAGE_SIZE,
        },
    }
}
