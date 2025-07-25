import { db, DbTransaction } from '@/db'
import { contactEnrichmentTasks } from '@/db/schema'
import { contactEnrichmentTaskAdapters } from '@/modules/background-tasks/contact-enrichment-task.adapters'
import { ContactEnrichmentTaskEntity } from '@/modules/background-tasks/domain/contact-enrichment-task.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { eq } from 'drizzle-orm'

export const contactEnrichmentTasksRepo = {
    findById: async (id: string, tx?: DbTransaction) => {
        const invoker = tx || db

        const [task] = await invoker
            .select()
            .from(contactEnrichmentTasks)
            .where(eq(contactEnrichmentTasks.id, id))

        if (!task) {
            return null
        }

        return contactEnrichmentTaskAdapters.dbToEntity(task)
    },

    save: async (task: ContactEnrichmentTaskEntity, tx?: DbTransaction) => {
        return contactEnrichmentTasksRepo.saveMany([task], tx)
    },

    saveMany: async (
        tasks: ContactEnrichmentTaskEntity[],
        tx?: DbTransaction
    ): Promise<void> => {
        const invoker = tx || db

        if (tasks.length === 0) {
            return
        }

        await invoker
            .insert(contactEnrichmentTasks)
            .values(tasks.map(contactEnrichmentTaskAdapters.entityToDb))
            .onConflictDoUpdate({
                target: contactEnrichmentTasks.id,
                set: buildConflictUpdateExcludeColumns(contactEnrichmentTasks, [
                    'id',
                    'contactId',
                    'jobId',
                    'organisationId',
                    'createdAt',
                ]),
            })
    },
}
