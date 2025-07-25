import { db } from '@/db'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { segmentFilterRepository } from '@/server/segments/segment-repository'
import { SegmentFilterOperator } from '@/server/segments/segment.entity'
import { createOrganisationSegmentUseCase } from '@/server/segments/use-cases/create-organisation-segment.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { SegmentCreateRequestBody } from '@ascenta-plus/types'

export async function createSegmentController(
    body: SegmentCreateRequestBody,
    organisationId: string,
    user: UserDTO
): Promise<{ id: string }> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const segment = await db.transaction(async (tx) => {
        const segment = await createOrganisationSegmentUseCase(
            body,
            organisation,
            user,
            tx
        )

        await segmentFilterRepository.createMany(
            {
                filters: body.filters.map((filter) => {
                    return {
                        ...filter,
                        operator: new SegmentFilterOperator(filter.operator),
                    }
                }),
                organisationId: organisation.id,
                segmentId: segment.id,
            },
            tx
        )

        return segment
    })

    return { id: segment.id.value }
}
