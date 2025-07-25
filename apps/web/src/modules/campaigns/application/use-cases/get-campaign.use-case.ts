import { campaignRepository } from '@/modules/campaigns/infrastructure/campaign-repository'
import { UserDTO } from '@/shared/dtos/user.dto'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function getCampaignUseCase(
    campaignId: string,
    organisationId: string,
    user: UserDTO
) {
    const campaign = await campaignRepository.findById(campaignId)
    if (!campaign) {
        throw new NotFoundError('Campaign not found.')
    }

    if (campaign.props.organisationId !== organisationId) {
        throw new ForbiddenError('You do not have access to this campaign.')
    }

    return campaign
}
