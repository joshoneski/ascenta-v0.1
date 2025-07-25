import { UpdateOrganisationParams } from '@ascenta-plus/web/src/server/organisations/organisation.types'
import {
    OrganisationDetailsDTO,
    OrganisationMemberListItemDTO,
} from '@ascenta-plus/web/src/shared/dtos/organisation.dto'

export type OrganisationCreateRequestBody = {
    name: string
    slug: string
}

export type OrganisationCreateResponse = {
    id: string
    slug: string
}

export type OrganisationRetrieveRequestBody = {}

export type OrganisationRetrieveResponse = OrganisationDetailsDTO

export type OrganisationUpdateRequestBody = UpdateOrganisationParams

export type OrganisationUpdateResponse = {
    success: boolean
}

export type OrganisationMembersRequestBody = {}

export type OrganisationMembersResponse = {
    members: OrganisationMemberListItemDTO[]
}
