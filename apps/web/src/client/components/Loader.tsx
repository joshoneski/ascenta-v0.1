import { cn } from '@/client/lib/utils'

export function Loader(props: { className?: string; size: 16 | 24 | 32 | 48 }) {
    return (
        <div className="p-0.5">
            <div
                className={cn(
                    'aspect-square animate-spin rounded-full border-solid border-l-transparent',
                    'border-t-current border-r-current border-b-current',
                    {
                        'h-3 border-1': props.size === 16,
                        'h-5 border-2': props.size === 24,
                        'h-8 border-3': props.size === 32,
                        'h-11 border-4': props.size === 48,
                    },
                    props.className
                )}
            />
        </div>
    )
}
