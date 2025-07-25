import { getClickByTokenUseCase } from '@/modules/clicks/application/use-cases/get-click-by-token.use-case'

// TODO request and result types
export async function getClickByTokenController(request: { token: string }) {
    const click = await getClickByTokenUseCase(request.token)

    return {
        id: click.props.id,
        destinationUrl: click.props.destinationUrl,
    }
}
