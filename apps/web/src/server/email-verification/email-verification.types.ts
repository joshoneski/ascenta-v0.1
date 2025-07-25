import { z } from 'zod'

export const EmailVerificationStatusEnum = z.enum([
    'invalid',
    'processing',
    'valid',
    'unverified',
])

export const EmailVerificationCheckEnum = z.enum([
    'failed',
    'passed',
    'pending',
    'unknown',
])

export type EmailVerificationStatus = z.infer<
    typeof EmailVerificationStatusEnum
>
export type EmailVerificationCheckResult = z.infer<
    typeof EmailVerificationCheckEnum
>

type EmailCheckType =
    | 'blacklisted'
    | 'disposable'
    | 'deliverable'
    | 'roleBased'
    | 'syntax'

export type EmailVerificationCheck = Record<
    EmailCheckType,
    EmailVerificationCheckResult
>

export type CreateEmailVerificationParams = {
    email: string
    status: EmailVerificationStatus
    blacklisted: EmailVerificationCheckResult
    deliverable: EmailVerificationCheckResult
    disposable: EmailVerificationCheckResult
    roleBased: EmailVerificationCheckResult
    syntax: EmailVerificationCheckResult
}

export type EmailVerificationDTO = {
    id: string
    email: string
    status: EmailVerificationStatus
    checks: EmailVerificationCheck
    createdAt: number
}
