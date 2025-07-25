'use client'

import { Button } from '@/client/components/ui/button'
import { Label } from '@/client/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/client/components/ui/popover'
import { Textarea } from '@/client/components/ui/textarea'
import { PopoverClose, PopoverContentProps } from '@radix-ui/react-popover'
import { LoaderCircleIcon, SaveIcon } from 'lucide-react'
import { ReactNode, useState, useTransition } from 'react'

export const PopoverTextarea = (props: {
    align?: PopoverContentProps['align']
    className?: string
    children: ReactNode
    defaultValue: string
    label?: string
    placeholder: string
    side?: PopoverContentProps['side']
    onSave?: (value: string) => Promise<void>
}) => {
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(props.defaultValue)

    const handleOpenChange = (open: boolean) => {
        setOpen(open)
        if (open) {
            // reset input value on open
            setValue(props.defaultValue)
        }
    }

    async function handleSave() {
        if (isLoading) {
            return
        }

        setIsLoading(true)
        try {
            startTransition(async () => {
                await props.onSave?.(value)
                setOpen(false)
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>{props.children}</PopoverTrigger>
            <PopoverContent
                align={props.align || 'start'}
                side={props.side || 'right'}
            >
                {props.label ? <Label>{props.label}</Label> : null}
                <Textarea
                    className={props.className}
                    placeholder={props.placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" onClick={handleSave}>
                        {isLoading || isPending ? (
                            <LoaderCircleIcon className="size-4 animate-spin" />
                        ) : (
                            <SaveIcon className="size-4" />
                        )}
                        <span>Save</span>
                    </Button>
                    <PopoverClose asChild>
                        <Button size="sm" variant="secondary">
                            Cancel
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    )
}
