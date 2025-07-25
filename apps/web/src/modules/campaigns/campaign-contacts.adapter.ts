import { campaignContacts } from '@/db/schema'
import { CampaignContactEntity } from '@/modules/campaigns/domain/campaign-contact.entity'

export const campaignContactAdapters = {
    dbToEntity: (
        campaignContact: typeof campaignContacts.$inferSelect
    ): CampaignContactEntity => {
        return new CampaignContactEntity({
            id: campaignContact.id,
            campaignId: campaignContact.campaignId,
            contactId: campaignContact.contactId,
            organisationId: campaignContact.organisationId,
            createdAt: campaignContact.createdAt,
        })
    },

    entityToDb: (
        campaignContact: CampaignContactEntity
    ): typeof campaignContacts.$inferInsert => {
        return {
            id: campaignContact.props.id,
            campaignId: campaignContact.props.campaignId,
            contactId: campaignContact.props.contactId,
            organisationId: campaignContact.props.organisationId,
            createdAt: campaignContact.props.createdAt,
        }
    },
}
