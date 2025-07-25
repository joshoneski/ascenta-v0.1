import { campaignEmailDeliveryRepository } from '@/modules/campaigns/infrastructure/campaign-email-delivery-repository'
import { RequestContext } from '@/server/_utils/request'
import { ForbiddenError, NotFoundError } from '@/shared/errors'

export async function getCampaignEmailDeliveryUseCase(
    ctx: RequestContext,
    campaignDeliveryEmailId: string
) {
    const delivery = await campaignEmailDeliveryRepository.findById(
        campaignDeliveryEmailId
    )
    if (!delivery) {
        throw new NotFoundError('Email delivery not found.')
    }

    if (ctx.actor.type === 'system') {
        return delivery
    }

    if (delivery.props.organisationId !== ctx.organisation?.id) {
        throw new ForbiddenError(
            'You do not have access to this email delivery.'
        )
    }

    return delivery
}
