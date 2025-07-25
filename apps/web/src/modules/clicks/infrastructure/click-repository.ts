import { db, DbTransaction } from '@/db'
import { clicks } from '@/db/schema'
import { clickAdapters } from '@/modules/clicks/click.adapters'
import { ClickEntity } from '@/modules/clicks/domain/click.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { eq } from 'drizzle-orm'

export const clickRepository = {
    findById: async (id: string): Promise<ClickEntity | null> => {
        const [click] = await db.select().from(clicks).where(eq(clicks.id, id))

        if (!click) {
            return null
        }

        return clickAdapters.dbToEntity(click)
    },

    findByToken: async (token: string): Promise<ClickEntity | null> => {
        const [click] = await db
            .select()
            .from(clicks)
            .where(eq(clicks.token, token))

        if (!click) {
            return null
        }

        return clickAdapters.dbToEntity(click)
    },

    save: async (click: ClickEntity, tx?: DbTransaction): Promise<void> => {
        const invoker = tx || db

        const [result] = await invoker
            .insert(clicks)
            .values([clickAdapters.entityToDb(click)])
            .onConflictDoUpdate({
                target: clicks.id,
                set: buildConflictUpdateExcludeColumns(clicks, [
                    'id',
                    'token',
                    'organisationId',
                    'createdAt',
                ]),
            })
            .returning({ id: clicks.id })

        if (!result) {
            throw new Error('Failed to save click.')
        }
    },
}
