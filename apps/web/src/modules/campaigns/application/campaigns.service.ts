import { getCampaignDetailsController } from '@/modules/campaigns/application/controllers/get-campaign-details.controller'
import { getCampaignMetadataController } from '@/modules/campaigns/application/controllers/get-campaign-metadata.controller'
import {
    CampaignCreateRequest,
    CampaignDetailsRequest,
    CampaignListRequest,
    CampaignMetadataRequest,
    CampaignPauseRequest,
} from '@/modules/campaigns/campaigns.types'
import { RequestContext } from '@/server/_utils/request'
import { createCampaignController } from './controllers/create-campaign.controller'
import { getCampaignsController } from './controllers/get-campaigns.controller'
import { pauseCampaignController } from './controllers/pause-campaign.controller'

class CampaignsService {
    createCampaign(ctx: RequestContext, request: CampaignCreateRequest) {
        return createCampaignController(ctx, request)
    }

    getCampaigns(ctx: RequestContext, request: CampaignListRequest) {
        return getCampaignsController(ctx, request)
    }

    getCampaignDetails(request: CampaignDetailsRequest) {
        return getCampaignDetailsController(request)
    }

    getCampaignMetadata(request: CampaignMetadataRequest) {
        return getCampaignMetadataController(request)
    }

    pauseCampaign(request: CampaignPauseRequest) {
        return pauseCampaignController(request)
    }
}

export const campaignsService = new CampaignsService()
