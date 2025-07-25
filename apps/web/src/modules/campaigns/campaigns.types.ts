import { CampaignPriceEstimateDTO } from '@/shared/dtos/campaign-price-estimate.dto'
import { PaginationMeta } from '@/shared/dtos/pagination.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

export type CampaignDraftStep = 'goals' | 'strategy' | 'content' | 'review'
export type CampaignStatus = 'draft' | 'paused' | 'running' | 'finished'
export type CampaignEmailStatus = 'failed' | 'ready' | 'scheduled' | 'sent'
export type CampaignEmailDeliveryStatus =
    | 'failed'
    | 'processing'
    | 'scheduled'
    | 'sent'

export type CampaignListItemDTO = {
    id: string
    createdAt: number
    title: string
    clickCount: number
    contactCount: number
    emailsSent: number
    status: CampaignStatus
}

export type CampaignOptionDto = {
    id: string
    name: string
}

export type CampaignEmailDTO = {
    id: string
    day: number
    sample: string
    subject: string
}

export type CampaignCompleteStrategyRequest = {
    campaignId: string
    organisationId: string
    user: UserDTO
}
export type CampaignCompleteStrategyResult = void

export type CampaignCompleteContentRequest = {
    campaignId: string
    organisationId: string
    user: UserDTO
}
export type CampaignCompleteContentResult = void

export type CampaignCreateRequest = {
    brief: string
    ctaUrl: string
    segmentId?: string | null
    senderId: string
    domainSenderId?: string | null
    organisationId: string
    user: UserDTO // TODO: replace with id and use auth service
}
export type CampaignCreateResult = {
    id: string
}

export type CampaignContentRequest = {
    id: string
    organisationId: string
    user: UserDTO
}
export type CampaignContentResult = {
    emails: CampaignEmailDTO[]
}

export type CampaignDetailsRequest = {
    id: string
    organisationId: string
    user: UserDTO
}
export type CampaignDetailsResult = {
    ctaUrl: string
    segmentId: string | null
    segmentName: string | null
    domainSenderId: string | null
    domainSenderName: string | null
    title: string
    strategy: string
    summary: string
}

export type CampaignEmailImproveRequest = {
    id: string
    improvements: string
    organisationId: string
    user: UserDTO
}
export type CampaignEmailImproveResult = {
    sample: string
}

export type CampaignListRequest = {
    page?: number
    organisationId: string
    user: UserDTO // TODO: replace with id and use auth service
}
export type CampaignListResult = {
    campaigns: CampaignListItemDTO[]
    meta: PaginationMeta
}

export type CampaignMetadataRequest = {
    id: string
    organisationId: string
    user: UserDTO
}
export type CampaignMetadataResult = {
    status: CampaignStatus
    draftStep: CampaignDraftStep | null
}

export type CampaignStatsRequest = {
    id: string
    organisationId: string
    user: UserDTO
}
export type CampaignStatsResult = {
    clickCount: number
    contactCount: number
    emailsSent: number
}

export type CampaignPauseRequest = {
    campaignId: string
    organisationId: string
    user: UserDTO // TODO: replace with id and use auth service
}
export type CampaignPauseResponse = void

export type CampaignLaunchRequest = {
    campaignId: string
    organisationId: string
    user: UserDTO
}
export type CampaignLaunchResponse = void

export type CampaignUpdateRequest = {
    update: {
        title?: string
        strategy?: string
        summary?: string
        segmentId?: string | null
    }
    campaignId: string
    organisationId: string
    user: UserDTO // TODO: replace with id and use auth service
}
export type CampaignUpdateResponse = void

export type CampaignPriceEstimateRequest = {
    campaignId: string
    organisationId: string
    user: UserDTO
}

export type CampaignPriceEstimateResponse = CampaignPriceEstimateDTO
