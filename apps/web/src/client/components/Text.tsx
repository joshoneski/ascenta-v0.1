import { cn } from '@/client/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

export const textVariants = cva('block', {
    variants: {
        variant: {
            h1: 'font-display font-black leading-[1.1] text-3xl',
            h2: 'font-display font-black leading-[1.1] text-2xl',
            h3: 'font-display font-black leading-[1.1] text-xl',
            h4: 'font-display font-extrabold leading-[1.1]',
            body2xl: 'text-2xl',
            bodyXl: 'text-xl',
            bodyLg: 'text-lg',
            body: '',
            bodySm: 'text-sm',
            bodyXs: 'text-xs',
        },
    },
    defaultVariants: {
        variant: 'body',
    },
})

export interface TextProps extends VariantProps<typeof textVariants> {
    as?:
        | 'dt'
        | 'dd'
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'p'
        | 'span'
        | 'strong'
        | 'legend'
    children?: React.ReactNode
    className?: string
    id?: string
    onClick?: () => void
    style?: React.CSSProperties
}

export const Text = (props: TextProps) => {
    const { as, children, className, variant, ...restProps } = props

    const ElementType = as ?? 'span'

    return (
        <ElementType
            className={cn(textVariants({ variant }), className)}
            {...restProps}
        >
            {children}
        </ElementType>
    )
}
