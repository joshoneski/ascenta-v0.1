import { Container } from '@/client/components/Container'
import { cn } from '@/client/lib/utils'
import React from 'react'

export const DashboardPage = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...restProps } = props

    return <Container className={cn('py-12', className)} {...restProps} />
}
