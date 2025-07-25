import { CampaignEmailDeliveryStatus } from '@/modules/campaigns'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'

export type EmailStatus = 'invalid' | 'processing' | 'valid' | 'unverified'
export type EmailStatusCheckResult = 'failed' | 'passed' | 'pending' | 'unknown'

export type ContactCreateParams = {
    email: string
    firstName: string | null
    lastName: string | null
    organisationId: OrganisationId
}

export type ContactUpsertParams = {
    email: string
    firstName?: string | null
    lastName?: string | null
}

export type ContactUpsertManyParams = ContactUpsertParams[]

export type ContactUpdateParams = {
    email?: string
    firstName?: string | null
    lastName?: string | null
}

export type ContactBulkEnrichRequest = {
    organisationId: string
    user: UserDTO
}

export type ContactBulkEnrichResult = void

export type ContactActivityRequest = {
    contactId: string
}

export type ContactActivityDTO = {
    type: 'email_delivery'
    data: {
        id: string
        campaignTitle: string
        error: string | null
        html: string | null
        status: CampaignEmailDeliveryStatus
        statusUpdatedAt: Date
        subject: string | null
    }
}

export type ContactActivityResult = {
    data: Array<ContactActivityDTO>
    // meta: PaginationMeta // TODO
}

export type ContactEnrichmentStatsRequest = {
    organisationId: string
    user: UserDTO
}

export type ContactEnrichmentStatsResult = {
    enrichedContacts: number
    totalContacts: number
}
