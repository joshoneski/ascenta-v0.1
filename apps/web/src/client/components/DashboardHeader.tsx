import { Text } from '@/client/components/Text'
import { cn } from '@/client/lib/utils'
import React, { HTMLAttributes } from 'react'

export default function DashboardHeader(
    props: HTMLAttributes<HTMLDivElement> & {
        rightContent?: React.ReactNode
        subtitleContent?: React.ReactNode
        title: React.ReactNode | string
    }
) {
    const { className, rightContent, subtitleContent, title } = props

    return (
        <div className={cn('mb-6 flex items-start justify-between', className)}>
            <div className="grow">
                {typeof title === 'string' ? (
                    <Text variant="h1">{title}</Text>
                ) : (
                    title
                )}
                {subtitleContent}
            </div>
            <div>{rightContent}</div>
        </div>
    )
}
