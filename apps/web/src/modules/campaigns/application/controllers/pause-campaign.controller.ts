import {
    CampaignPauseRequest,
    CampaignPauseResponse,
} from '@/modules/campaigns/campaigns.types'
import { campaignRepository } from '@/modules/campaigns/infrastructure/campaign-repository'
import { checkAdminAccess } from '@/server/auth/use-cases/is-admin.use-case'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function pauseCampaignController(
    request: CampaignPauseRequest
): Promise<CampaignPauseResponse> {
    const campaign = await campaignRepository.findById(request.campaignId)
    if (!campaign) {
        throw new NotFoundError('Campaign not found.')
    }

    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const canPause =
        campaign.props.organisationId == organisation.id.value &&
        (await checkAdminAccess(request.user.id))

    if (!canPause) {
        throw new ForbiddenError(
            'You do not have access to pause this campaign.'
        )
    }

    campaign.pause()
    await campaignRepository.save(campaign)

    // Do we need to pause emails?
    // this.campaignEmails
    //     .filter((email) => email.props.status === 'scheduled')
    //     .forEach((email) => {
    //         email.pause()
    //     })
}
