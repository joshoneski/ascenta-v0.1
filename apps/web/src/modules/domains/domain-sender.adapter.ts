import { domainSenders } from '@/db/schema'
import { DomainSenderEntity } from '@/modules/domains/domain/domain-sender.entity'

export const domainSenderAdapters = {
    dbToEntity: (
        domainSender: typeof domainSenders.$inferSelect
    ): DomainSenderEntity => {
        return new DomainSenderEntity({
            id: domainSender.id,
            domainId: domainSender.domainId,
            organisationId: domainSender.organisationId,
            name: domainSender.name,
            username: domainSender.username,
            createdAt: domainSender.createdAt,
        })
    },

    entityToDb: (
        domainSender: DomainSenderEntity
    ): typeof domainSenders.$inferInsert => {
        return {
            id: domainSender.props.id,
            domainId: domainSender.props.domainId,
            organisationId: domainSender.props.organisationId,
            name: domainSender.props.name,
            username: domainSender.props.username,
            createdAt: domainSender.props.createdAt,
        }
    },
}
