import { DbTransaction } from '@/db'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { segmentRepository } from '@/server/segments/segment-repository'
import { CreateSegmentParams } from '@/server/segments/segment.types'
import { UserDTO } from '@/shared/dtos/user.dto'

export async function createOrganisationSegmentUseCase(
    params: CreateSegmentParams,
    organisation: OrganisationEntity,
    user: UserDTO,
    tx: DbTransaction
) {
    return segmentRepository.create(
        { ...params, organisationId: organisation.id },
        tx
    )
}
