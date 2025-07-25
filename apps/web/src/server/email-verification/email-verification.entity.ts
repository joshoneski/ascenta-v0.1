import {
    EmailVerificationCheckResult,
    EmailVerificationStatus,
} from '@/server/email-verification/email-verification.types'

type EmailVerificationEntityProps = {
    id: string
    createdAt: Date
    email: string
    status: EmailVerificationStatus
    blacklisted: EmailVerificationCheckResult
    deliverable: EmailVerificationCheckResult
    disposable: EmailVerificationCheckResult
    roleBased: EmailVerificationCheckResult
    syntax: EmailVerificationCheckResult
}

export class EmailVerificationEntity {
    public readonly props: EmailVerificationEntityProps

    constructor(input: EmailVerificationEntityProps) {
        this.props = { ...input }
    }
}
