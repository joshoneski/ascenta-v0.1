import { OrganisationId } from '@/server/organisations/organisation.entity'
import { segmentReadRepository } from '@/server/segments/segment-read-repository'

export async function countSegmentContactsUseCase(
    segmentId: string,
    organisationId: OrganisationId
): Promise<number> {
    return segmentReadRepository.getSegmentContactCount({
        filter: {
            segmentId,
            organisationId,
        },
    })
}
