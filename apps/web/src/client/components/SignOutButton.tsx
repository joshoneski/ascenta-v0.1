'use client'

import { clientAuth } from '@/client/client-auth'
import { Button } from '@/client/components/ui/button'
import { routes } from '@/shared/routes'
import { Slot } from '@radix-ui/react-slot'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

type SignOutButtonProps = {
    asChild?: boolean
    children?: ReactNode
    className?: string
}

export function SignOutButton({
    asChild,
    children,
    className,
}: SignOutButtonProps) {
    const Component = asChild ? Slot : Button

    const router = useRouter()

    return (
        <Component
            onClick={() => {
                clientAuth.signOut().finally(() => {
                    router.push(routes.login)
                })
            }}
            className={className}
        >
            {children ?? 'Sign Out'}
        </Component>
    )
}
