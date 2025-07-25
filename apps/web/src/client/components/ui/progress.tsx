'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/client/lib/utils'

function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full w-full flex-1 transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
}

type ProgressSegment = {
    value: number
    color?: string
}

function MultiProgress({
    className,
    segments,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
    segments: ProgressSegment[]
}) {
    const sortedSegments = segments.sort((a, b) => a.value - b.value)

    return (
        <ProgressPrimitive.Root
            className={cn(
                'bg-secondary relative h-6 w-full overflow-hidden rounded',
                className
            )}
            {...props}
        >
            {sortedSegments.map((segment, index) => (
                <ProgressPrimitive.Indicator
                    key={index}
                    className={cn(
                        'absolute h-full transition-all',
                        segment.color ? segment.color : 'bg-primary'
                    )}
                    style={{
                        width: `${segment.value}%`,
                        zIndex: sortedSegments.length - index,
                    }}
                />
            ))}
        </ProgressPrimitive.Root>
    )
}

MultiProgress.displayName = 'MultiProgress'

export { MultiProgress, Progress }
