'use client'

import { Button } from '@/client/components/ui/button'
import { Input } from '@/client/components/ui/input'
import { Label } from '@/client/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/client/components/ui/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { LoaderCircleIcon, SaveIcon } from 'lucide-react'
import { ReactNode, useState } from 'react'

export const PopoverInput = (props: {
    children: ReactNode
    defaultValue: string
    label?: string
    placeholder: string
    onSave?: (value: string) => Promise<void>
}) => {
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
            await props.onSave?.(value)
            setOpen(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>{props.children}</PopoverTrigger>
            <PopoverContent align="start" side="right">
                {props.label ? <Label>{props.label}</Label> : null}
                <Input
                    placeholder={props.placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" onClick={handleSave}>
                        {isLoading ? (
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
