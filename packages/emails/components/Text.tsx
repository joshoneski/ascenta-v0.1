import { cn } from '@ascenta-plus/web/src/client/lib/utils'
import {
    Text as EmailText,
    TextProps as EmailTextProps,
} from '@react-email/components'
import { cva, VariantProps } from 'class-variance-authority'
import { body, heading } from '../styles/fonts'

const textVariants = cva('my-0', {
    variants: {
        variant: {
            h1: 'text-2xl',
            h2: 'text-xl',
            h3: 'text-lg',
            bodyMd: 'text-base font-sans',
            bodySm: 'text-sm font-sans',
            bodyXs: 'text-xs font-sans',
        },
    },
    defaultVariants: {
        variant: 'bodyMd',
    },
})

interface TextProps extends EmailTextProps, VariantProps<typeof textVariants> {}

export const Text = (props: TextProps) => {
    const { className, children, style, variant, ...restProps } = props

    return (
        <EmailText
            style={{
                ...(variant === 'h1' || variant === 'h2' || variant === 'h3'
                    ? heading
                    : body),
                ...style,
            }}
            className={cn(textVariants({ variant }), className)}
            {...restProps}
        >
            {children}
        </EmailText>
    )
}
