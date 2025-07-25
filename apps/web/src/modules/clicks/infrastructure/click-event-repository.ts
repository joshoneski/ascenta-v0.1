import { db, DbTransaction } from '@/db'
import { clickEvents } from '@/db/schema'
import { clickEventAdapters } from '@/modules/clicks/click-event.adapters'
import { ClickEventEntity } from '@/modules/clicks/domain/click-event.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'

export const clickEventsRepository = {
    save: async (
        clickEvent: ClickEventEntity,
        tx?: DbTransaction
    ): Promise<void> => {
        const invoker = tx || db

        const [result] = await invoker
            .insert(clickEvents)
            .values([clickEventAdapters.entityToDb(clickEvent)])
            .onConflictDoUpdate({
                target: clickEvents.id,
                set: buildConflictUpdateExcludeColumns(clickEvents, [
                    'id',
                    'clickId',
                    'organisationId',
                    'createdAt',
                ]),
            })
            .returning({ id: clickEvents.id })

        if (!result) {
            throw new Error('Failed to save click event.')
        }
    },
}
