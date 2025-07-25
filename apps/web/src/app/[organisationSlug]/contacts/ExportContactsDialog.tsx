'use client'

import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/client/components/ui/dialog'
import { api } from '@/client/lib/api'
import { DownloadIcon, LoaderCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export function ExportContactsDialog(props: {
    children?: React.ReactNode
    organisationId: string
}) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        if (isLoading) {
            return
        }

        const link = document.createElement('a')
        link.href = api.contacts.exportUrl({
            organisation: props.organisationId,
        })
        link.download = 'contacts.csv'
        link.click()

        setIsLoading(true)
        setTimeout(() => {
            toast.success('Contacts successfully exported.')
            setOpen(false)
            setTimeout(() => {
                setIsLoading(false)
            }, 300)
        }, 2000)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Export contacts</DialogTitle>
                    <DialogDescription>
                        Download a CSV of your contacts.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={handleClick} disabled={isLoading}>
                        <span>Export</span>
                        {isLoading ? (
                            <LoaderCircleIcon className="size-4 animate-spin" />
                        ) : (
                            <DownloadIcon className="size-4" />
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
