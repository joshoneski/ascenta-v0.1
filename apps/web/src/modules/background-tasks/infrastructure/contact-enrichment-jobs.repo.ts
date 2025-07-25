import { db, DbTransaction } from '@/db'
import { contactEnrichmentJobs, contactEnrichmentTasks } from '@/db/schema'
import { contactEnrichmentJobAdapters } from '@/modules/background-tasks/contact-enrichment-job.adapters'
import { ContactEnrichmentJobEntity } from '@/modules/background-tasks/domain/contact-enrichment-job.entity'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { and, count, eq, sql } from 'drizzle-orm'

export const contactEnrichmentJobsRepo = {
    findById: async (id: string, tx?: DbTransaction) => {
        const invoker = tx || db

        const [job] = await invoker
            .select()
            .from(contactEnrichmentJobs)
            .where(eq(contactEnrichmentJobs.id, id))

        if (!job) {
            return null
        }

        return contactEnrichmentJobAdapters.dbToEntity(job)
    },

    getActiveJobs: async (organisationId: string, tx?: DbTransaction) => {
        const invoker = tx || db

        const jobs = await invoker
            .select()
            .from(contactEnrichmentJobs)
            .where(
                and(
                    eq(contactEnrichmentJobs.organisationId, organisationId),
                    eq(contactEnrichmentJobs.status, 'running')
                )
            )

        return jobs.map(contactEnrichmentJobAdapters.dbToEntity)
    },

    getJobStats: async (jobId: string, tx?: DbTransaction) => {
        const invoker = tx || db

        const [result] = await invoker
            .select({
                completedTasks: sql<number>`count(*) filter (where
                ${eq(contactEnrichmentTasks.status, 'completed')}
                )`.mapWith(Number),
                failedTasks: sql<number>`count(*) filter (where
                ${eq(contactEnrichmentTasks.status, 'failed')}
                )`.mapWith(Number),
                totalTasks: count(contactEnrichmentTasks),
            })
            .from(contactEnrichmentTasks)
            .where(eq(contactEnrichmentTasks.jobId, jobId))

        if (!result) {
            return null
        }

        return {
            completedTasks: result.completedTasks,
            failedTasks: result.failedTasks,
            totalTasks: result.totalTasks,
        }
    },

    save: async (job: ContactEnrichmentJobEntity, tx?: DbTransaction) => {
        const invoker = tx || db

        await invoker
            .insert(contactEnrichmentJobs)
            .values(contactEnrichmentJobAdapters.entityToDb(job))
            .onConflictDoUpdate({
                target: contactEnrichmentJobs.id,
                set: buildConflictUpdateExcludeColumns(contactEnrichmentJobs, [
                    'id',
                    'organisationId',
                    'createdAt',
                ]),
            })
    },
}
