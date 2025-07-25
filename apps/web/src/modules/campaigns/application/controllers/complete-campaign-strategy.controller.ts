import { db } from '@/db'
import {
    CampaignCompleteStrategyRequest,
    CampaignCompleteStrategyResult,
} from '@/modules/campaigns'
import { createSmartCampaignContentUseCase } from '@/modules/campaigns/application/use-cases/create-smart-campaign-content.use-case'
import { getCampaignUseCase } from '@/modules/campaigns/application/use-cases/get-campaign.use-case'
import { CampaignEmailEntity } from '@/modules/campaigns/domain/campaign-email.entity'
import { campaignEmailRepository } from '@/modules/campaigns/infrastructure/campaign-email-repository'
import { campaignRepository } from '@/modules/campaigns/infrastructure/campaign-repository'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { BadRequestError } from '@/shared/errors'
import { v4 as uuidv4 } from 'uuid'

export async function completeCampaignStrategyController(
    request: CampaignCompleteStrategyRequest
): Promise<CampaignCompleteStrategyResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    const campaign = await getCampaignUseCase(
        request.campaignId,
        organisation.id.value,
        request.user
    )

    if (
        campaign.props.status !== 'draft' ||
        campaign.props.draftStep !== 'strategy'
    ) {
        throw new BadRequestError('Campaign strategy cannot be edited.')
    }

    const { emails } = await createSmartCampaignContentUseCase(
        campaign,
        organisation.displayName,
        ''
    )
    campaign.props.draftStep = 'content'

    await db.transaction(async (tx) => {
        await campaignRepository.save(campaign, tx)
        await campaignEmailRepository.saveMany(
            emails.map((email) => {
                return new CampaignEmailEntity({
                    id: uuidv4(),
                    createdAt: new Date(),
                    campaignId: campaign.props.id,
                    organisationId: request.organisationId,
                    contentFocus: email.contentFocus,
                    purpose: email.purpose,
                    sample: email.sampleEmail,
                    sentAt: null,
                    startOffsetMs: daysToMilliseconds(email.day - 1),
                    status: 'ready',
                    subject: email.subject,
                })
            }),
            tx
        )
    })
}

function daysToMilliseconds(days: number) {
    return days * 24 * 60 * 60 * 1000
}
