import { ClickEntity } from '@/modules/clicks/domain/click.entity'
import { backendConfig } from '@/server/backend-config'
import { routes } from '@/shared/routes'

export const absoluteClickUrl = (click: ClickEntity) => {
    return `${backendConfig.HOST_DOMAIN}${routes.click(click.props.token)}`
}
