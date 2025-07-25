import { db } from '@/db'
import { emailVerifications } from '@/db/schema'
import { emailVerificationsAdapters } from '@/server/email-verification/email-verification.adapter'
import { CreateEmailVerificationParams } from '@/server/email-verification/email-verification.types'
import { desc, eq } from 'drizzle-orm'

export const emailVerificationsRepo = {
    query: {
        findLatestByEmail: async (email: string) => {
            const [latest] = await db
                .select()
                .from(emailVerifications)
                .where(eq(emailVerifications.email, email))
                .orderBy(desc(emailVerifications.createdAt))
                .limit(1)

            if (!latest) {
                return null
            }

            return emailVerificationsAdapters.dbToEntity(latest)
        },
    },
    mutate: {
        create: async (params: CreateEmailVerificationParams) => {
            const [emailVerification] = await db
                .insert(emailVerifications)
                .values([params])
                .returning()

            if (!emailVerification) {
                throw new Error('Failed to create email verification.')
            }

            return emailVerificationsAdapters.dbToEntity(emailVerification)
        },
    },
}
