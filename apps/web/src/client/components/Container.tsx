import { cn } from '@/client/lib/utils'
import React from 'react'

export const Container = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...restProps } = props

    return (
        <div
            className={cn(
                'mx-auto w-full max-w-[64rem] px-4 md:px-6 lg:px-12',
                className
            )}
            {...restProps}
        />
    )
}
