export const SEGMENT_FIELD_LABELS = {
    enrichmentScore: 'Data Score',
    country: 'Country',
    city: 'City',
    region: 'State',
}

export const SEGMENT_OPERATOR_LABELS = {
    '=': 'equals',
    '!=': 'does not equal',
    '>': 'greater than',
    '>=': 'greater than or equal',
    '<': 'less than',
    '<=': 'less than or equal',
}

export const SEGMENT_FIELDS = [
    { value: 'enrichmentScore', label: 'Data Score', type: 'number' },
    { value: 'country', label: 'Country', type: 'text' },
    { value: 'city', label: 'City', type: 'text' },
    { value: 'region', label: 'State', type: 'text' },
    // { value: 'firstName', label: 'First Name', type: 'text' },
    // { value: 'lastName', label: 'Last Name', type: 'text' },
    // { value: 'company', label: 'Company', type: 'text' },
    // { value: 'jobTitle', label: 'Job Title', type: 'text' },
    // { value: 'dateCreated', label: 'Date Created', type: 'date' },
    // { value: 'lastActivity', label: 'Last Activity', type: 'date' },
]

export const SEGMENT_OPERATORS = {
    text: [
        { value: '=', label: 'equals' },
        // { value: 'contains', label: 'contains' },
        // { value: 'startsWith', label: 'starts with' },
        // { value: 'endsWith', label: 'ends with' },
        { value: '!=', label: 'does not equal' },
    ],
    number: [
        { value: '=', label: 'equals' },
        { value: '!=', label: 'does not equal' },
        { value: '>', label: 'greater than' },
        { value: '>=', label: 'greater than or equal' },
        { value: '<', label: 'less than' },
        { value: '<=', label: 'less than or equal' },
    ],
    date: [
        { value: 'equals', label: 'equals' },
        { value: 'before', label: 'before' },
        { value: 'after', label: 'after' },
        { value: 'between', label: 'between' },
    ],
}

export type SegmentDetailsDTO = {
    id: string
    organisation: string
    createdAt: number
    name: string
    filters: SegmentFilterDTO[]
}

export type SegmentListItemDTO = {
    id: string
    name: string
    contactCount: number
    createdAt: number
}

export type SegmentFilterDTO = {
    id: string
    field: string
    operator: string
    value: unknown
}
