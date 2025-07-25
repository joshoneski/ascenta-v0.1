import { AnyColumn, Column, sql } from 'drizzle-orm'

export function coalesce<T extends unknown>(name: string, columns: Column[]) {
    const values = sql.join(
        columns.map((column) => sql`${column}`),
        sql.raw(',')
    )

    return sql<T>`COALESCE(
    ${values}
    )`.as(name)
}

export function increment(column: AnyColumn, value = 1) {
    return sql`${column} + ${value}`
}
