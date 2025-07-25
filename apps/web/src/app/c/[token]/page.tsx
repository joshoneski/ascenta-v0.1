import { createClickEventController } from '@/modules/clicks/application/controllers/create-click-event.controller'
import { getClickByTokenController } from '@/modules/clicks/application/controllers/get-click-by-token.controller'
import { redirect } from 'next/navigation'

export default async function Page(props: {
    params: Promise<{ token: string }>
}) {
    const { token } = await props.params

    const click = await getClickByTokenController({ token })

    await createClickEventController(click.id)

    redirect(click.destinationUrl)
}
