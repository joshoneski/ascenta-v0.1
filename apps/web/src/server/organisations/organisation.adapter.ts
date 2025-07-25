import { members, organisations } from '@/db/schema'
import { UserId } from '@/server/auth/user.entity'
import {
    OrganisationEntity,
    OrganisationId,
    OrganisationMemberEntity,
    OrganisationMemberId,
} from '@/server/organisations/organisation.entity'
import { DEFAULT_PRIMARY_COLOR } from '@/shared/constants'
import { OrganisationDTO } from '@/shared/dtos/organisation.dto'

export const organisationAdapters = {
    dbToEntity: (
        organisation: typeof organisations.$inferSelect
    ): OrganisationEntity =>
        new OrganisationEntity(
            new OrganisationId(organisation.id),
            organisation.displayName,
            organisation.slug,
            organisation.primaryColor || DEFAULT_PRIMARY_COLOR,
            organisation.type,
            organisation.createdAt
        ),

    entityToDTO: (organisation: OrganisationEntity): OrganisationDTO => ({
        id: organisation.id.value,
        object: 'organisation',
        createdAt: organisation.createdAt.getTime(), // TODO: keep as number or date?
        displayName: organisation.displayName,
        slug: organisation.slug,
        primaryColor: organisation.primaryColor,
        type: organisation.type,
    }),
}

export const organisationMemberAdapters = {
    dbToEntity: (
        organisationMember: typeof members.$inferSelect
    ): OrganisationMemberEntity =>
        new OrganisationMemberEntity(
            new OrganisationMemberId(organisationMember.id),
            new OrganisationId(organisationMember.organisationId),
            new UserId(organisationMember.userId),
            organisationMember.createdAt
        ),
}
