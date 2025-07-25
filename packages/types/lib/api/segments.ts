export type SegmentCreateRequestBody = {
    name: string
    filters: {
        field: string
        operator: string
        value: unknown
    }[]
}

export type SegmentCreateResponse = {
    id: string
}
