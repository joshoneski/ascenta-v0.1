import { db } from '@/db'
import {
    contactEnrichmentTasks,
    emailVerifications,
    enrichedContactsView,
} from '@/db/schema'
import { ContactEnrichmentJobEntity } from '@/modules/background-tasks/domain/contact-enrichment-job.entity'
import { ContactEnrichmentTaskEntity } from '@/modules/background-tasks/domain/contact-enrichment-task.entity'
import { contactEnrichmentJobsRepo } from '@/modules/background-tasks/infrastructure/contact-enrichment-jobs.repo'
import { contactEnrichmentTasksRepo } from '@/modules/background-tasks/infrastructure/contact-enrichment-tasks.repo'
import { inngest } from '@/modules/background-tasks/infrastructure/inngest-client'
import { sendSlackSupportNotification } from '@/server/_lib/slack'
import { RequestContext } from '@/server/_utils/request'
import { checkAdminAccess } from '@/server/auth/use-cases/is-admin.use-case'
import { ContactBulkEnrichRequest } from '@/server/contacts/contact.types'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { ForbiddenError } from '@/shared/errors'
import { and, eq, isNull, or } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function bulkEnrichContactController(
    ctx: RequestContext,
    request: ContactBulkEnrichRequest
) {
    if (
        ctx.actor.type !== 'system' &&
        !(await checkAdminAccess(ctx.actor.id))
    ) {
        await sendSlackSupportNotification(
            'Feature Access Denied',
            [
                'User tried to bulk verify contacts.',
                '',
                `User: ${ctx.actor.id}`,
                `Organisation: ${ctx.organisation?.id}`,
            ].join('\n')
        )
        throw new ForbiddenError(
            'You do not have access to this feature. Please contact support@littlephil.org for assistance.'
        )
    }

    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    // TODO: deny if there is a current queue for enrichment for this org

    const unenrichedContacts = await db
        .select({ id: enrichedContactsView.id })
        .from(enrichedContactsView)
        .leftJoin(
            contactEnrichmentTasks,
            eq(contactEnrichmentTasks.contactId, enrichedContactsView.id)
        )
        .leftJoin(
            emailVerifications,
            eq(emailVerifications.id, enrichedContactsView.emailVerificationId)
        )
        .where(
            and(
                // Contact must belong to organisation
                eq(enrichedContactsView.organisationId, organisation.id.value),
                // Contact must not be verified or attached to a person
                or(
                    eq(emailVerifications.status, 'unverified'),
                    isNull(emailVerifications.status),
                    isNull(enrichedContactsView.personId)
                ),
                // Contact must not be in a current task
                or(
                    isNull(contactEnrichmentTasks.id),
                    eq(contactEnrichmentTasks.status, 'completed'),
                    eq(contactEnrichmentTasks.status, 'failed'),
                    eq(contactEnrichmentTasks.status, 'skipped')
                )
            )
        )

    // TODO: handle 0

    const now = new Date()

    const job = new ContactEnrichmentJobEntity({
        id: uuidv4(),
        organisationId: organisation.id.value,
        status: 'running', // TODO: queued?
        totalCount: 0,
        completedCount: 0,
        failedCount: 0,
        startedAt: now,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
    })

    const tasks = unenrichedContacts.map((contact) => {
        return new ContactEnrichmentTaskEntity({
            id: uuidv4(),
            contactId: contact.id,
            jobId: job.props.id,
            organisationId: organisation.id.value,
            status: 'queued',
            error: null,
            startedAt: null,
            completedAt: null,
            createdAt: now,
            updatedAt: now,
        })
    })

    job.props.totalCount = tasks.length

    await db.transaction(async (tx) => {
        await contactEnrichmentJobsRepo.save(job, tx)
        await contactEnrichmentTasksRepo.saveMany(tasks, tx)

        // Note: If Inngest fails the transaction will be rolled back
        await inngest.send(
            tasks.map((task) => {
                return {
                    name: 'contact.enrichment.scheduled',
                    data: {
                        taskId: task.props.id,
                        organisationId: organisation.id.value,
                    },
                }
            })
        )
    })
}
