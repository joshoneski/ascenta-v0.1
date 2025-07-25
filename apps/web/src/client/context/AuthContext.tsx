'use client'

import { OrganisationDTO } from '@/shared/dtos/organisation.dto'
import React, { createContext, useContext } from 'react'

const AuthContext = createContext<{
    organisation: OrganisationDTO | null
} | null>(null)

export function useClientAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useClientAuth must be within AuthProvider.')
    }

    return context
}

export function AuthProvider(props: {
    children: React.ReactNode
    organisation: OrganisationDTO | null
}) {
    const value = {
        organisation: props.organisation,
    }

    return <AuthContext.Provider value={value} {...props} />
}
