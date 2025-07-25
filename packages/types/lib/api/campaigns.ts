import { CampaignUpdateRequest } from '@ascenta-plus/web/src/modules/campaigns'
import { CampaignPriceEstimateDTO } from '@ascenta-plus/web/src/shared/dtos/campaign-price-estimate.dto'

export type CampaignCompleteStrategyApiRequestBody = {}

export type CampaignCompleteStrategyApiResponse = {
    success: boolean
}

export type CampaignCompleteContentApiRequestBody = {}

export type CampaignCompleteContentApiResponse = {
    success: boolean
}

export type CampaignCreateApiRequestBody = {
    brief: string
    ctaUrl: string
    segment?: string | null
    sender: string
}

export type CampaignCreateApiResponse = {
    id: string
}

export type CampaignEmailImproveApiRequestBody = {
    improvements: string
}

export type CampaignEmailImproveApiResponse = {
    sample: string
}

export type CampaignListApiRequestBody = {}

export type CampaignListApiResponse = {}

export type CampaignUpdateApiRequestBody = CampaignUpdateRequest['update']

export type CampaignUpdateApiResponse = {
    success: boolean
}

export type CampaignLaunchApiRequestBody = {}

export type CampaignLaunchApiResponse = {
    success: boolean
}

export type CampaignPriceEstimateApiResponse = CampaignPriceEstimateDTO
