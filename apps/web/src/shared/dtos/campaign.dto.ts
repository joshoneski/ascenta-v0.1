import { CampaignDraftStep, CampaignStatus } from '@/modules/campaigns'

export type CampaignDetailsDTO = {
    title: string
    ctaUrl: string
    segmentId: string | null
    segmentName: string | null
    strategy: string
    summary: string
}

export type CampaignMetadataDTO = {
    status: CampaignStatus
    draftStep: CampaignDraftStep | null
}
