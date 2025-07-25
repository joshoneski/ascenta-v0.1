import { campaigns } from '@/db/schema'
import { CampaignEntity } from '@/modules/campaigns/domain/campaign.entity'

export const campaignsAdapters = {
    dbToEntity: (campaign: typeof campaigns.$inferSelect) =>
        new CampaignEntity({
            id: campaign.id,
            createdAt: campaign.createdAt,
            title: campaign.title,
            status: campaign.status,
            draftStep: campaign.draftStep,
            pausedAt: campaign.pausedAt,
            totalPausedMs: campaign.totalPausedMs,
            organisationId: campaign.organisationId,
            segmentId: campaign.segmentId,
            domainSenderId: campaign.domainSenderId,
            summary: campaign.summary,
            strategy: campaign.strategy,
            ctaUrl: campaign.ctaUrl,
            startedAt: campaign.startedAt,
            endedAt: campaign.endedAt,
        }),

    entityToDb: (entity: CampaignEntity): typeof campaigns.$inferInsert => ({
        id: entity.props.id,
        createdAt: entity.props.createdAt,
        title: entity.props.title,
        organisationId: entity.props.organisationId,
        segmentId: entity.props.segmentId,
        domainSenderId: entity.props.domainSenderId,
        status: entity.props.status,
        draftStep: entity.props.draftStep,
        pausedAt: entity.props.pausedAt,
        totalPausedMs: entity.props.totalPausedMs,
        strategy: entity.props.strategy,
        summary: entity.props.summary,
        ctaUrl: entity.props.ctaUrl,
        startedAt: entity.props.startedAt,
        endedAt: entity.props.endedAt,
    }),
}
