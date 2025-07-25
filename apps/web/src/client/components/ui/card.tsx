import * as React from 'react'

import { Text, TextProps } from '@/client/components/Text'
import { cn } from '@/client/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn(
                'bg-card text-card-foreground rounded-xl border',
                className
            )}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn('flex flex-col gap-1.5 px-6 pt-6', className)}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: TextProps) {
    return (
        <Text
            data-slot="card-title"
            className={className}
            variant="h2"
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-content"
            className={cn('px-6 py-6', className)}
            {...props}
        />
    )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-footer"
            className={cn('flex items-center px-6 pb-6', className)}
            {...props}
        />
    )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
