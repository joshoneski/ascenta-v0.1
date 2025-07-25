import { enrichedContactsView, segmentFilters } from '@/db/schema'
import {
    BinaryOperator,
    Column,
    eq,
    gt,
    gte,
    lt,
    lte,
    ne,
    SQL,
} from 'drizzle-orm'

const opMap: Record<string, BinaryOperator> = {
    '=': eq,
    '!=': ne,
    '>=': gte,
    '>': gt,
    '<': lt,
    '<=': lte,
}

const columnMap: Record<string, Column> = {
    enrichmentScore: enrichedContactsView.enrichmentScore,
    city: enrichedContactsView.city,
    country: enrichedContactsView.country,
    region: enrichedContactsView.region,
}

// const valueMap = {
//     enrichmentScore: enrichedContactsView.enrichmentScore.dataType,
// }

// TODO: type
export function buildSegmentDbFilters(
    filters: (typeof segmentFilters.$inferSelect)[]
) {
    const dbFilters: SQL[] = []

    filters.forEach((filter) => {
        const op = opMap[filter.operator]
        if (!op) {
            throw new Error('Invalid segment operator.')
        }

        const value = filter.value
        // TODO: check if we need to cast or if Drizzle always returns back the correct type
        // if (typeof value !== 'number') {
        //     throw new Error('Invalid segment filter')
        // }

        const col = columnMap[filter.field]
        if (!col) {
            throw new Error('Invalid segment field.')
        }

        dbFilters.push(op(col, value))
    })

    return dbFilters
}
