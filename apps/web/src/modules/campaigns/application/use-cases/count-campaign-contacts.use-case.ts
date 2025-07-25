import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { campaignContactsRepository } from '@/modules/campaigns/infrastructure/campaign-contacts-repository'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { NotFoundError } from '@/shared/errors'

export async function countCampaignContactsUseCase(
    campaignId: string,
    organisationId: OrganisationId,
    user: UserDTO
): Promise<number> {
    const campaign = await getCampaignUseCase(
        campaignId,
        organisationId.value,
        user
    )
    if (!campaign) {
        throw new NotFoundError('Campaign not found')
    }

    return campaignContactsRepository.getCampaignContactCount(campaignId)
}
