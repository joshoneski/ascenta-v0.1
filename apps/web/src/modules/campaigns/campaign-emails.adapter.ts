import { campaignEmails } from '@/db/schema'
import { CampaignEmailEntity } from '@/modules/campaigns/domain/campaign-email.entity'

export const campaignEmailAdapters = {
    dbToEntity: (email: typeof campaignEmails.$inferSelect) =>
        new CampaignEmailEntity({
            id: email.id,
            campaignId: email.campaignId,
            organisationId: email.organisationId,
            contentFocus: email.contentFocus,
            purpose: email.purpose,
            sample: email.sample,
            status: email.status,
            startOffsetMs: email.startOffsetMs,
            subject: email.subject,
            createdAt: email.createdAt,
            sentAt: email.sentAt,
        }),

    entityToDb: (
        email: CampaignEmailEntity
    ): typeof campaignEmails.$inferSelect => ({
        id: email.props.id,
        campaignId: email.props.campaignId,
        organisationId: email.props.organisationId,
        contentFocus: email.props.contentFocus,
        purpose: email.props.purpose,
        sample: email.props.sample,
        status: email.props.status,
        startOffsetMs: email.props.startOffsetMs,
        subject: email.props.subject,
        createdAt: email.props.createdAt,
        sentAt: email.props.sentAt,
    }),
}
