import { contactEnrichmentJobsRepo } from '@/modules/background-tasks/infrastructure/contact-enrichment-jobs.repo'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function getActiveContactEnrichmentJobsUseCase(
    organisationId: OrganisationId,
    user: UserDTO
) {
    return contactEnrichmentJobsRepo.getActiveJobs(organisationId.value)
}
