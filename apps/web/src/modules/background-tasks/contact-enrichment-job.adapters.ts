import { contactEnrichmentJobs } from '@/db/schema'
import { ContactEnrichmentJobEntity } from '@/modules/background-tasks/domain/contact-enrichment-job.entity'

export const contactEnrichmentJobAdapters = {
    dbToEntity: (
        job: typeof contactEnrichmentJobs.$inferSelect
    ): ContactEnrichmentJobEntity =>
        new ContactEnrichmentJobEntity({
            id: job.id,
            organisationId: job.organisationId,
            status: job.status,
            totalCount: job.totalCount,
            completedCount: job.completedCount,
            failedCount: job.failedCount,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        }),

    entityToDb: (
        job: ContactEnrichmentJobEntity
    ): typeof contactEnrichmentJobs.$inferSelect => ({
        id: job.props.id,
        organisationId: job.props.organisationId,
        status: job.props.status,
        totalCount: job.props.totalCount,
        completedCount: job.props.completedCount,
        failedCount: job.props.failedCount,
        startedAt: job.props.startedAt,
        completedAt: job.props.completedAt,
        createdAt: job.props.createdAt,
        updatedAt: job.props.updatedAt,
    }),
}
