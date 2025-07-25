import { DbTransaction } from '@/db'
import { ClickTypeValue } from '@/modules/clicks/click.emums'
import { ClickEntity } from '@/modules/clicks/domain/click.entity'
import { clickRepository } from '@/modules/clicks/infrastructure/click-repository'
import { customAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
)

export async function createClickUseCase(
    {
        destinationUrl,
        organisationId,
        type,
        metadata = {},
    }: {
        destinationUrl: string
        organisationId: string
        type: ClickTypeValue
        metadata?: Record<string, unknown>
    },
    tx?: DbTransaction
) {
    const click = new ClickEntity({
        id: uuidv4(),
        token: nanoid(12),
        organisationId,
        type,
        destinationUrl,
        metadata,
        createdAt: new Date(),
    })

    await clickRepository.save(click, tx)

    return click
}
