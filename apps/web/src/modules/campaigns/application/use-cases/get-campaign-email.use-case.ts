import { campaignEmailRepository } from '@/modules/campaigns/infrastructure/campaign-email-repository'
import { RequestContext } from '@/server/_utils/request'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function getCampaignEmailUseCase(
    ctx: RequestContext,
    campaignEmailId: string
) {
    const campaignEmail =
        await campaignEmailRepository.findById(campaignEmailId)
    if (!campaignEmail) {
        throw new NotFoundError('Email not found.')
    }

    if (ctx.actor.type === 'system') {
        return campaignEmail
    }

    if (campaignEmail.props.organisationId !== ctx.organisation?.id) {
        throw new ForbiddenError('You do not have access to this email.')
    }

    return campaignEmail
}
