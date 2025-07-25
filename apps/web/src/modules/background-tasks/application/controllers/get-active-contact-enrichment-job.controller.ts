import {
    ActiveContactEnrichmentJobRequest,
    ActiveContactEnrichmentJobResult,
} from '@/modules/background-tasks/contact-enrichment-job.type'
import { contactEnrichmentJobsRepo } from '@/modules/background-tasks/infrastructure/contact-enrichment-jobs.repo'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { FatalError } from '@/shared/errors'
import { getActiveContactEnrichmentJobsUseCase } from '../use-cases/get-active-contact-enrichment-jobs.use-case'

export async function getActiveContactEnrichmentJobController(
    request: ActiveContactEnrichmentJobRequest
): Promise<ActiveContactEnrichmentJobResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const activeContactEnrichmentJobs =
        await getActiveContactEnrichmentJobsUseCase(
            organisation.id,
            request.user
        )

    const [activeContactEnrichmentJob] = activeContactEnrichmentJobs
    if (!activeContactEnrichmentJob) {
        return null
    }

    const stats = await contactEnrichmentJobsRepo.getJobStats(
        activeContactEnrichmentJob.props.id
    )
    if (!stats) {
        throw new FatalError('Failed to load queue stats.')
    }

    return {
        id: activeContactEnrichmentJob.props.id,
        completed: stats.completedTasks,
        failed: stats.failedTasks,
        total: stats.totalTasks,
    }
}
