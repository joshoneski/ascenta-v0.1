import { EmailVerificationService } from '@/server/email-verification/email-verification-service'

const emailVerificationService = new EmailVerificationService()

export function verifyEmailDeliverabilityUseCase(email: string) {
    return emailVerificationService.verifyDeliverability(email)
}
