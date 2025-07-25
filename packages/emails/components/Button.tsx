import { cn } from '@ascenta-plus/web/src/client/lib/utils'
import {
    Button as EmailButton,
    ButtonProps as EmailButtonProps,
} from '@react-email/components'
import { body } from '../styles/fonts'

interface ButtonProps extends EmailButtonProps {}

export const Button = (props: ButtonProps) => {
    const { className, children, style, ...restProps } = props

    return (
        <EmailButton
            className={cn(
                'cursor-pointer rounded-full bg-purple-700 px-6 py-4 text-sm text-white',
                className
            )}
            style={{
                ...body,
                ...style,
            }}
            {...restProps}
        >
            {children}
        </EmailButton>
    )
}
