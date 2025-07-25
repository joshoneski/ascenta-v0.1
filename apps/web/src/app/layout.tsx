import { NavigationLoaderProvider } from '@/client/components/providers/NavigationLoaderProvider'
import { QueryProvider } from '@/client/components/providers/QueryProvider'
import { Toaster } from '@/client/components/ui/sonner'
import type { Metadata } from 'next'
import { Catamaran, Open_Sans } from 'next/font/google'
import React from 'react'
import './globals.css'

const catamaran = Catamaran({
    display: 'swap',
    subsets: ['latin'],
    weight: ['400', '800', '900'],
    variable: '--font-catamaran',
})

const openSans = Open_Sans({
    display: 'swap',
    subsets: ['latin'],
    weight: '400',
    variable: '--font-open-sans',
})

export const metadata: Metadata = {
    title: 'Little Phil Ignite - AI-powered fundraising & marketing suite',
    description:
        'Little Phil Ignite brings AI-powered fundraising & marketing to charities—slash costs, enrich donor data, and grow impact with automated outreach.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${catamaran.variable} ${openSans.variable} font-main`}
            >
                <QueryProvider>
                    <NavigationLoaderProvider>
                        {children}
                    </NavigationLoaderProvider>
                </QueryProvider>
                <Toaster />
            </body>
        </html>
    )
}
