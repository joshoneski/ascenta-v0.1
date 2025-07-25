import { db } from '@/db'
import { contactEnrichmentJobsRepo } from '@/modules/background-tasks/infrastructure/contact-enrichment-jobs.repo'
import { contactEnrichmentTasksRepo } from '@/modules/background-tasks/infrastructure/contact-enrichment-tasks.repo'
import { getSystemAuth } from '@/server/auth/get-system-auth'
import { enrichContactController } from '@/server/enrichment/controllers/enrich-contact.controller'
import { inngest } from '../../infrastructure/inngest-client'

export const enrichContactTask = inngest.createFunction(
    {
        id: 'enrich-contact',
        concurrency: [
            {
                // Tenant limit
                key: 'event.data.organisationId',
                limit: 1,
            },
            {
                // Global limit
                limit: 20,
            },
        ],
        onFailure: async ({ event, error }) => {
            // if the task fails after all retries, mark as failed
            await db.transaction(async (tx) => {
                const task = await contactEnrichmentTasksRepo.findById(
                    event.data.event.data.taskId,
                    tx
                )
                if (!task) {
                    throw new Error('Failed to return task.')
                }

                const job = await contactEnrichmentJobsRepo.findById(
                    task.props.jobId,
                    tx
                )
                if (!job) {
                    throw new Error('Failed to return job.')
                }

                task.markAsFailed(error.message)
                job.incrementFailedTasks()
                job.markAsCompleteIfNeeded()

                await contactEnrichmentTasksRepo.save(task, tx)
                await contactEnrichmentJobsRepo.save(job, tx)
            })
        },
    },
    { event: 'contact.enrichment.scheduled' },
    async ({ event, step }) => {
        const taskId = event.data.taskId
        const { buildSystemRequestContext, getSystemUser } = getSystemAuth()
        const ctx = buildSystemRequestContext('inngress', 'job')
        const user = await getSystemUser()

        await step.run('mark-as-processing', async () => {
            const task = await contactEnrichmentTasksRepo.findById(taskId)
            if (!task) {
                throw new Error('Failed to return task.')
            } else if (task.props.status !== 'queued') {
                return
            }

            task.markAsProcessing()
            await contactEnrichmentTasksRepo.save(task)
        })

        await step.run('enrich-contact', async () => {
            const task = await contactEnrichmentTasksRepo.findById(taskId)
            if (!task) {
                throw new Error('Failed to return task.')
            } else if (task.props.status !== 'processing') {
                return
            }

            await enrichContactController(
                ctx,
                task.props.contactId,
                task.props.organisationId,
                user
            )
        })

        await step.run('mark-as-completed', async () => {
            await db.transaction(async (tx) => {
                const task = await contactEnrichmentTasksRepo.findById(
                    taskId,
                    tx
                )
                if (!task) {
                    throw new Error('Failed to return task.')
                } else if (task.props.status !== 'processing') {
                    return
                }

                const job = await contactEnrichmentJobsRepo.findById(
                    task.props.jobId,
                    tx
                )
                if (!job) {
                    throw new Error('Failed to return job.')
                }

                task.markAsCompleted()
                job.incrementCompletedTasks()
                job.markAsCompleteIfNeeded()

                await contactEnrichmentTasksRepo.save(task, tx)
                await contactEnrichmentJobsRepo.save(job, tx)
            })
        })
    }
)
