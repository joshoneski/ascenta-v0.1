import { DbTransaction } from '@/db'
import { campaignContactsRepository } from '@/modules/campaigns/infrastructure/campaign-contacts-repository'
import { OrganisationId } from '@/server/organisations/organisation.entity'

export async function getCampaignContactsSnapshotUseCase(
    segmentId: string | null,
    organisationId: OrganisationId,
    tx?: DbTransaction
): Promise<string[]> {
    // If no segment, get all contact IDs for the organization
    if (!segmentId) {
        return campaignContactsRepository.getAllContactIds(
            organisationId.value,
            tx
        )
    }

    // Get contact IDs matching the segment
    return campaignContactsRepository.getSegmentContactIds(
        segmentId,
        organisationId.value,
        tx
    )
}