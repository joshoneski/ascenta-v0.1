import { backendConfig } from '@/server/backend-config'
import { ExtractTablesWithRelations } from 'drizzle-orm'
import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { PgTransaction } from 'drizzle-orm/pg-core'
import * as schema from './schema'

export type DbTransaction = PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
>

export const db = drizzle(backendConfig.POSTGRES_URL, {
    schema,
})
