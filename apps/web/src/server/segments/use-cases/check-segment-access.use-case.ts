import { segmentReadRepository } from '@/server/segments/segment-read-repository'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function checkSegmentAccessUseCase(
    segmentId: string,
    organisationId: string,
    userId: string
): Promise<void> {
    const segment = await segmentReadRepository.getSegmentDetails(segmentId)
    if (!segment) {
        throw new NotFoundError('Segment not found.')
    }

    if (segment.organisation !== organisationId) {
        throw new ForbiddenError('You do not have access to this segment.')
    }
}
