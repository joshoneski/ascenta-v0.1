'use client'

import { Loader } from '@/client/components/Loader'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/client/components/ui/dialog'
import { routes } from '@/shared/routes'
import { Slot } from '@radix-ui/react-slot'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export const SelectOrganisationTrigger = (props: {
    asChild?: boolean
    children?: React.ReactNode
    organisationSlug: string
}) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    async function handleSelect() {
        setIsLoading(true)
        setTimeout(() => {
            router.push(routes.dashboard.root(props.organisationSlug))
        }, 1000)
    }

    return (
        <>
            {props.asChild ? (
                <Slot onClick={handleSelect}>{props.children}</Slot>
            ) : (
                <button onClick={handleSelect}>{props.children}</button>
            )}

            <Dialog open={isLoading}>
                <DialogContent className="py-16">
                    <DialogTitle className="flex items-center justify-center gap-4 font-normal">
                        <Loader size={24} />
                        <p>Switching organisation...</p>
                    </DialogTitle>
                </DialogContent>
            </Dialog>
        </>
    )
}
