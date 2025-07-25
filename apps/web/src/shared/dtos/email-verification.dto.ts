export type EmailStatus = 'invalid' | 'valid'
export type EmailStatusReason =
    | 'blacklisted'
    | 'disposable'
    | 'role_based'
    | 'syntax_error'
    | 'undeliverable'

export type EmailVerificationDTO = {
    status: 'invalid' | 'processing' | 'valid' | 'unverified'
    checks: {
        blacklisted: 'failed' | 'passed' | 'pending' | 'unknown'
        disposable: 'failed' | 'passed' | 'pending' | 'unknown'
        deliverable: 'failed' | 'passed' | 'pending' | 'unknown'
        roleBased: 'failed' | 'passed' | 'pending' | 'unknown'
        syntax: 'failed' | 'passed' | 'pending' | 'unknown'
    }
}
