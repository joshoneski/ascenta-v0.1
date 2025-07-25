import { contactEnrichmentTasks } from '@/db/schema'
import { ContactEnrichmentTaskEntity } from '@/modules/background-tasks/domain/contact-enrichment-task.entity'

export const contactEnrichmentTaskAdapters = {
    dbToEntity: (
        task: typeof contactEnrichmentTasks.$inferSelect
    ): ContactEnrichmentTaskEntity =>
        new ContactEnrichmentTaskEntity({
            id: task.id,
            contactId: task.contactId,
            jobId: task.jobId,
            organisationId: task.organisationId,
            status: task.status,
            error: task.error,
            startedAt: task.startedAt,
            completedAt: task.completedAt,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }),

    entityToDb: (
        task: ContactEnrichmentTaskEntity
    ): typeof contactEnrichmentTasks.$inferSelect => ({
        id: task.props.id,
        contactId: task.props.contactId,
        jobId: task.props.jobId,
        organisationId: task.props.organisationId,
        status: task.props.status,
        attempts: 0, // TODO: remove
        error: task.props.error,
        startedAt: task.props.startedAt,
        completedAt: task.props.completedAt,
        createdAt: task.props.createdAt,
        updatedAt: task.props.updatedAt,
    }),
}
