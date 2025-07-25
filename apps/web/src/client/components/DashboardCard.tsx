import { cn } from '@/client/lib/utils'
import React from 'react'

export const DashboardCard = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn('rounded-lg border', className)} {...props} />
}

export const DashboardCardHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn('p-4', className)} {...props} />
}

export const DashboardCardTitle = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn('p-4', className)} {...props} />
}

export const DashboardCardContent = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn('px-4 pb-4', className)} {...props} />
}
