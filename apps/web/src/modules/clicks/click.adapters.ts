import { clicks } from '@/db/schema'
import { ClickEntity } from '@/modules/clicks/domain/click.entity'

export const clickAdapters = {
    dbToEntity: (data: typeof clicks.$inferSelect): ClickEntity => {
        return new ClickEntity({
            id: data.id,
            organisationId: data.organisationId,
            token: data.token,
            type: data.type,
            destinationUrl: data.destinationUrl,
            metadata: data.metadata,
            createdAt: data.createdAt,
        })
    },

    entityToDb: (entity: ClickEntity): typeof clicks.$inferInsert => {
        return {
            id: entity.props.id,
            organisationId: entity.props.organisationId,
            token: entity.props.token,
            type: entity.props.type,
            destinationUrl: entity.props.destinationUrl,
            metadata: entity.props.metadata,
            createdAt: entity.props.createdAt,
        }
    },
}
