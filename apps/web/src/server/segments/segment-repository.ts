import { DbTransaction } from '@/db'
import { segmentFilters, segments } from '@/db/schema'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import {
    segmentAdapters,
    segmentFilterAdapters,
} from '@/server/segments/segment.adapter'
import { SegmentId } from '@/server/segments/segment.entity'
import { CreateSegmentFilterParams } from '@/server/segments/segment.types'

export const segmentRepository = {
    create: async (
        params: { name: string; organisationId: OrganisationId },
        tx: DbTransaction
    ) => {
        const [segment] = await tx
            .insert(segments)
            .values([
                {
                    name: params.name,
                    organisationId: params.organisationId.value,
                },
            ])
            .returning()

        if (!segment) {
            throw new Error('Failed to create segments.') // TODO
        }

        return segmentAdapters.dbToEntity(segment)
    },
}

export const segmentFilterRepository = {
    createMany: async (
        params: {
            filters: CreateSegmentFilterParams[]
            organisationId: OrganisationId
            segmentId: SegmentId
        },
        tx: DbTransaction
    ) => {
        if (params.filters.length === 0) {
            return []
        }

        const results = await tx
            .insert(segmentFilters)
            .values(
                params.filters.map((filter) => {
                    return {
                        ...filter,
                        operator: filter.operator.value,
                        segmentId: params.segmentId.value,
                    }
                })
            )
            .returning()

        return results.map(segmentFilterAdapters.dbToEntity)
    },
}
