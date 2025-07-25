'use client'

import { AppProgressProvider } from '@bprogress/next'
import React from 'react'

export function NavigationLoaderProvider(props: { children: React.ReactNode }) {
    return (
        <AppProgressProvider
            height="4px"
            color="var(--accent)"
            options={{ showSpinner: false }}
            shallowRouting
        >
            {props.children}
        </AppProgressProvider>
    )
}
