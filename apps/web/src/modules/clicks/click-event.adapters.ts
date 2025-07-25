import { clickEvents } from '@/db/schema'
import { ClickEventEntity } from '@/modules/clicks/domain/click-event.entity'

export const clickEventAdapters = {
    dbToEntity: (data: typeof clickEvents.$inferSelect): ClickEventEntity => {
        return new ClickEventEntity({
            id: data.id,
            clickId: data.clickId,
            organisationId: data.organisationId,
            metadata: data.metadata,
            createdAt: data.createdAt,
        })
    },

    entityToDb: (entity: ClickEventEntity): typeof clickEvents.$inferInsert => {
        return {
            id: entity.props.id,
            clickId: entity.props.clickId,
            organisationId: entity.props.organisationId,
            metadata: entity.props.metadata,
            createdAt: entity.props.createdAt,
        }
    },
}
