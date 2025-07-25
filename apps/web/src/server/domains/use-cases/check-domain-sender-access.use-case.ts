import { domainSenders } from '@/db/schema'
import { db } from '@/db'
import { NotFoundError } from '@/shared/errors'
import { and, eq } from 'drizzle-orm'

export async function checkDomainSenderAccessUseCase(
    domainSenderId: string,
    organisationId: string,
    userId: string
): Promise<void> {
    const [domainSender] = await db
        .select()
        .from(domainSenders)
        .where(
            and(
                eq(domainSenders.id, domainSenderId),
                eq(domainSenders.organisationId, organisationId)
            )
        )

    if (!domainSender) {
        throw new NotFoundError('Domain sender not found or access denied')
    }
}