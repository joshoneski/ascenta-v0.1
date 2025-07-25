import { getTableColumns, SQL, sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'

export const buildConflictUpdateColumns = <
    T extends PgTable,
    Q extends keyof T['_']['columns'],
>(
    table: T,
    includeColumns: Q[]
) => {
    const columns = getTableColumns(table)

    return includeColumns.reduce(
        (acc, includeColumn) => {
            if (!columns[includeColumn]) {
                console.error(
                    `Invalid conflict update column "${includeColumn.toString()}"`
                )
                return acc
            }

            const colName = columns[includeColumn].name
            acc[includeColumn] = sql.raw(`excluded.${colName}`)
            return acc
        },
        {} as Record<Q, SQL>
    )
}

export const buildConflictUpdateExcludeColumns = <
    TTable extends PgTable,
    TColumn extends keyof TTable['_']['columns'],
>(
    table: TTable,
    excludedColumns: TColumn[]
) => {
    const columns = getTableColumns(table)

    return (Object.keys(columns) as TColumn[]).reduce(
        (acc, column) => {
            if (excludedColumns.includes(column)) {
                return acc
            }

            const colName = columns[column]!.name
            acc[column] = sql.raw(`excluded.${colName}`)
            return acc
        },
        {} as Record<TColumn, SQL>
    )
}
