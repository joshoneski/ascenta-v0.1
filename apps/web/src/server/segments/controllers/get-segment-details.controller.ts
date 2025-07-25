import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { segmentReadRepository } from '@/server/segments/segment-read-repository'
import { SegmentDetailsDTO } from '@/shared/dtos/segment.dto'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function getSegmentDetailsController(
    segmentId: string,
    organisationId: string,
    user: UserDTO
): Promise<SegmentDetailsDTO> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const segment = await segmentReadRepository.getSegmentDetails(segmentId)
    if (!segment) {
        throw new NotFoundError('Segment not found.')
    } else if (segment.organisation !== organisation.id.value) {
        throw new ForbiddenError('You do not have access to this segment.')
    }

    return segment
}
