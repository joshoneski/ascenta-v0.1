import { db } from '@/db'
import { contactEnrichmentTasks, enrichedContactsView } from '@/db/schema'
import {
    RecentContactEnrichmentTasksRequest,
    RecentContactEnrichmentTasksResult,
} from '@/modules/background-tasks/contact-enrichment-job.type'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { desc, eq } from 'drizzle-orm'

export async function getRecentContactEnrichmentTasksController(
    request: RecentContactEnrichmentTasksRequest
): Promise<RecentContactEnrichmentTasksResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const tasks = await db
        .select({
            id: contactEnrichmentTasks.id,
            status: contactEnrichmentTasks.status,
            contactEmail: enrichedContactsView.email,
            contactFirstName: enrichedContactsView.firstName,
            contactLastName: enrichedContactsView.lastName,
        })
        .from(contactEnrichmentTasks)
        .innerJoin(
            enrichedContactsView,
            eq(contactEnrichmentTasks.contactId, enrichedContactsView.id)
        )
        .where(eq(contactEnrichmentTasks.organisationId, organisation.id.value))
        .orderBy(desc(contactEnrichmentTasks.updatedAt))
        .limit(10)

    return {
        tasks: tasks.map((task) => {
            return {
                status: task.status,
                contact: {
                    email: task.contactEmail,
                    firstName: task.contactFirstName,
                    lastName: task.contactLastName,
                },
            }
        }),
    }
}
