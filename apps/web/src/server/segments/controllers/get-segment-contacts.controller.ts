import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { segmentReadRepository } from '@/server/segments/segment-read-repository'
import { ContactListItemDTO } from '@/shared/dtos/contact.dto'
import { PaginationMeta } from '@/shared/dtos/pagination.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

const PAGE_SIZE = 10

export async function getSegmentContactsController(
    page: number,
    segmentId: string,
    organisationId: string,
    user: UserDTO
): Promise<{ contacts: ContactListItemDTO[]; meta: PaginationMeta }> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const [contacts, count] = await Promise.all([
        segmentReadRepository.getSegmentContactList({
            filter: {
                segmentId: segmentId,
                organisationId: organisation.id,
            },
            skip: (page - 1) * PAGE_SIZE, // Note: pages start at 1 and not 0
            limit: PAGE_SIZE,
        }),
        segmentReadRepository.getSegmentContactCount({
            filter: {
                segmentId: segmentId,
                organisationId: organisation.id,
            },
        }),
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
