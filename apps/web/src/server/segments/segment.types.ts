import { SegmentFilterOperator } from '@/server/segments/segment.entity'

export type CreateSegmentParams = {
    name: string
}

export type CreateSegmentFilterParams = {
    field: string
    operator: SegmentFilterOperator
    value: unknown
}
