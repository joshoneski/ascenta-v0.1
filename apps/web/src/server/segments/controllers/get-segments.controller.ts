import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { segmentReadRepository } from '@/server/segments/segment-read-repository'
import { countSegmentContactsUseCase } from '@/server/segments/use-cases/count-segment-contacts.use-case'
import { PaginationMeta } from '@/shared/dtos/pagination.dto'
import { SegmentListItemDTO } from '@/shared/dtos/segment.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

const PAGE_SIZE = 10

export async function getSegmentsController(
    page: number,
    organisationId: string,
    user: UserDTO
): Promise<{ segments: SegmentListItemDTO[]; meta: PaginationMeta }> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const segments = await segmentReadRepository.getSegmentList({
        filter: {
            organisationId: organisation.id,
        },
        skip: (page - 1) * PAGE_SIZE, // Note: pages start at 1 and not 0
        limit: PAGE_SIZE,
    })

    const populatedSegments = await Promise.all(
        segments.map(async (segment) => {
            const contactCount = await countSegmentContactsUseCase(
                segment.id,
                organisation.id
            )

            return {
                id: segment.id,
                createdAt: segment.createdAt.getTime(),
                contactCount,
                name: segment.name,
            }
        })
    )

    const count = await segmentReadRepository.getSegmentCount(organisation.id)

    return {
        segments: populatedSegments,
        meta: {
            totalItems: count,
            page,
            pageCount: Math.ceil(count / PAGE_SIZE),
            pageSize: PAGE_SIZE,
        },
    }
}
