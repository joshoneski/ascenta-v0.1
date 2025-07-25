import { cn } from '@/client/lib/utils'
import { useEffect, useState } from 'react'

export const AnimatedEllipsisText = ({ isLoading }: { isLoading: boolean }) => {
    const [count, setCount] = useState(1)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCount((count) => {
                if (count === 3) {
                    return 1
                }
                return count + 1
            })
        }, 700)

        return () => clearTimeout(timeout)
    }, [count])

    return (
        <>
            <span className={cn({ 'opacity-0': count < 1 || !isLoading })}>
                .
            </span>
            <span className={cn({ 'opacity-0': count < 2 || !isLoading })}>
                .
            </span>
            <span className={cn({ 'opacity-0': count < 3 || !isLoading })}>
                .
            </span>
        </>
    )
}
