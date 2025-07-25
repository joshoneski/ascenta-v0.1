import { campaignEmailDeliveries } from '@/db/schema'
import { CampaignEmailDeliveryEntity } from '@/modules/campaigns/domain/campaign-email-delivery.entity'

export const campaignEmailDeliveryAdapters = {
    dbToEntity: (data: typeof campaignEmailDeliveries.$inferSelect) =>
        new CampaignEmailDeliveryEntity({
            id: data.id,
            campaignId: data.campaignId,
            campaignContactId: data.campaignContactId,
            campaignEmailId: data.campaignEmailId,
            organisationId: data.organisationId,
            error: data.error,
            status: data.status,
            statusUpdatedAt: data.statusUpdatedAt,
            senderEmail: data.senderEmail,
            senderName: data.senderName,
            recipientEmail: data.recipientEmail,
            subject: data.subject,
            html: data.html,
            createdAt: data.createdAt,
        }),

    entityToDb: (
        entity: CampaignEmailDeliveryEntity
    ): typeof campaignEmailDeliveries.$inferSelect => ({
        id: entity.props.id,
        campaignId: entity.props.campaignId,
        campaignContactId: entity.props.campaignContactId,
        campaignEmailId: entity.props.campaignEmailId,
        organisationId: entity.props.organisationId,
        error: entity.props.error,
        status: entity.props.status,
        statusUpdatedAt: entity.props.statusUpdatedAt,
        senderEmail: entity.props.senderEmail,
        senderName: entity.props.senderName,
        recipientEmail: entity.props.recipientEmail,
        subject: entity.props.subject,
        html: entity.props.html,
        createdAt: entity.props.createdAt,
    }),
}
