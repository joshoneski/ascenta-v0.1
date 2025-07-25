import { clickRepository } from '@/modules/clicks/infrastructure/click-repository'
import { NotFoundError } from '@/shared/errors'

export async function getClickByTokenUseCase(token: string) {
    const click = await clickRepository.findByToken(token)
    if (!click) {
        throw new NotFoundError('Click not found.')
    }

    // NOTE: there is no need to do auth here as token is public

    return click
}
