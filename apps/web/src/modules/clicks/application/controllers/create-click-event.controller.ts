import { ClickEventEntity } from '@/modules/clicks/domain/click-event.entity'
import { clickEventsRepository } from '@/modules/clicks/infrastructure/click-event-repository'
import { clickRepository } from '@/modules/clicks/infrastructure/click-repository'
import { NotFoundError } from '@/shared/errors'
import { v4 as uuidv4 } from 'uuid'

export async function createClickEventController(clickId: string) {
    const click = await clickRepository.findById(clickId)
    if (!click) {
        throw new NotFoundError('Click not found.')
    }

    const clickEvent = new ClickEventEntity({
        id: uuidv4(),
        clickId: click.props.id,
        organisationId: click.props.organisationId,
        metadata: {},
        createdAt: new Date(),
    })

    await clickEventsRepository.save(clickEvent)

    return { id: clickEvent.props.id }
}
