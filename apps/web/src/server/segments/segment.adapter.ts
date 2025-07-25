import { segmentFilters, segments } from '@/db/schema'
import {
    SegmentEntity,
    SegmentFilterEntity,
    SegmentFilterId,
    SegmentFilterOperator,
    SegmentId,
} from '@/server/segments/segment.entity'

export const segmentAdapters = {
    dbToEntity: (segment: typeof segments.$inferSelect): SegmentEntity =>
        new SegmentEntity(
            new SegmentId(segment.id),
            segment.name,
            segment.createdAt
        ),
}

export const segmentFilterAdapters = {
    dbToEntity: (
        segmentFilter: typeof segmentFilters.$inferSelect
    ): SegmentFilterEntity =>
        new SegmentFilterEntity(
            new SegmentFilterId(segmentFilter.id),
            new SegmentId(segmentFilter.segmentId),
            segmentFilter.field,
            new SegmentFilterOperator(segmentFilter.operator),
            segmentFilter.value,
            segmentFilter.createdAt
        ),
}
