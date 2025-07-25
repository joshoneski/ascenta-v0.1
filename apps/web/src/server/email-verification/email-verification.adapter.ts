import { emailVerifications } from '@/db/schema'
import { EmailVerificationEntity } from '@/server/email-verification/email-verification.entity'
import { EmailVerificationDTO } from '@/server/email-verification/email-verification.types'

export const emailVerificationsAdapters = {
    dbToEntity: (
        dataModel: typeof emailVerifications.$inferSelect
    ): EmailVerificationEntity =>
        new EmailVerificationEntity({
            id: dataModel.id,
            createdAt: dataModel.createdAt,
            email: dataModel.email,
            status: dataModel.status,
            blacklisted: dataModel.blacklisted,
            deliverable: dataModel.deliverable,
            disposable: dataModel.disposable,
            roleBased: dataModel.roleBased,
            syntax: dataModel.syntax,
        }),

    entityToDTO: (entity: EmailVerificationEntity): EmailVerificationDTO => ({
        id: entity.props.id,
        createdAt: entity.props.createdAt.getTime(),
        email: entity.props.email,
        status: entity.props.status,
        checks: {
            blacklisted: entity.props.blacklisted,
            deliverable: entity.props.deliverable,
            disposable: entity.props.disposable,
            roleBased: entity.props.roleBased,
            syntax: entity.props.syntax,
        },
    }),
}
