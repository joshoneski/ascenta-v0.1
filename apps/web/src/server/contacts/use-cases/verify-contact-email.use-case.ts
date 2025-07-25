import { sendSlackSupportNotification } from '@/server/_lib/slack'
import { RequestContext } from '@/server/_utils/request'
import { checkAdminAccess } from '@/server/auth/use-cases/is-admin.use-case'
import { EmailVerificationCheck } from '@/server/email-verification/email-verification.types'
import { verifyEmailDeliverabilityUseCase } from '@/server/email-verification/use-cases/verify-email-deliverability.use-case'
import { ForbiddenError } from '@/shared/errors'
import isEmail from 'validator/lib/isEmail'

const roleBasedLocals = ['help', 'support']

const disposableEmailDomains = [
    '10minutemail.com',
    'bofthew.com',
    'burnermail.io',
    'cool.fr.nf',
    'discardmail.com',
    'emailfake.com',
    'guerrillamail.com',
    'mail-temp.com',
    'maildrop.cc',
    'maildrop.cf',
    'maildrop.ga',
    'mailinator.com',
    'mohmal.com',
    'mohmal.in',
    'mohmal.tech',
    'mvrht.net',
    'myyopmail.com',
    'sharklasers.com',
    'spam4.me',
    'temp-mail.org',
    'tempmailaddress.com',
    'throwawaymail.com',
    'tmpmail.net',
    'yopmail.com',
]

export async function verifyContactEmailUseCase(
    ctx: RequestContext,
    email: string
) {
    if (
        ctx.actor.type !== 'system' &&
        !(await checkAdminAccess(ctx.actor.id))
    ) {
        await sendSlackSupportNotification(
            'Feature Access Denied',
            [
                'User tried to verify a contact.',
                '',
                `User: ${ctx.actor.id}`,
                `Contact email: ${email}`,
                `Organisation: ${ctx.organisation?.id}`,
            ].join('\n')
        )
        throw new ForbiddenError(
            'You do not have access to this feature. Please contact support@littlephil.org for assistance.'
        )
    }

    const checks: EmailVerificationCheck = {
        blacklisted: 'unknown',
        disposable: 'unknown',
        deliverable: 'unknown',
        roleBased: 'unknown',
        syntax: 'unknown',
    }

    checks.syntax = isEmail(email) ? 'passed' : 'failed'
    if (checks.syntax === 'passed') {
        const [local, host] = email.split('@') as [string, string]
        checks.blacklisted = isBlacklistedEmail(email) ? 'failed' : 'passed'
        checks.disposable = isDisposableEmail(host) ? 'failed' : 'passed'
        checks.roleBased = isRoleBasedEmail(local) ? 'failed' : 'passed'
        checks.deliverable = (await isDeliverable(email)) ? 'passed' : 'failed'
    }

    return {
        status: getCheckStatus(checks),
        checks,
    }
}

function isBlacklistedEmail(email: string) {
    return false
}

function isDisposableEmail(host: string) {
    return disposableEmailDomains.includes(host)
}

function isRoleBasedEmail(local: string) {
    return roleBasedLocals.includes(local)
}

async function isDeliverable(email: string) {
    return await verifyEmailDeliverabilityUseCase(email)
}

function getCheckStatus(
    checks: EmailVerificationCheck
): 'invalid' | 'valid' | 'unverified' {
    const values = Object.values(checks)

    if (values.includes('failed')) {
        return 'invalid'
    } else if (values.includes('unknown')) {
        return 'unverified'
    } else {
        return 'valid'
    }
}
