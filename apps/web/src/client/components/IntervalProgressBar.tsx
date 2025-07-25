import { Progress } from '@/client/components/ui/progress'
import { differenceInSeconds } from 'date-fns/differenceInSeconds'
import { useEffect, useState } from 'react'

export const IntervalProgressBar = (props: {
    className?: string
    progressFn: () => number
    onComplete?: () => void
    onProgress?: (progress: number) => void
}) => {
    const [progress, setProgress] = useState(props.progressFn())

    useEffect(() => {
        props.onProgress?.(progress)
        if (progress >= 100) {
            props.onComplete?.()
            return
        }

        const timeout = setTimeout(() => {
            setProgress(props.progressFn())
        }, 1000)

        return () => clearTimeout(timeout)
    }, [progress, props])

    return <Progress value={progress} />
}

export function progressFunc(
    startDate: Date,
    maxTimeInMilliseconds: number,
    velocity: number
) {
    return () => {
        const difference = differenceInSeconds(new Date(), startDate)

        const progressPercentage = difference / (maxTimeInMilliseconds / 1000)
        return (1 - Math.pow(1 - progressPercentage, velocity)) * 100
    }
}
