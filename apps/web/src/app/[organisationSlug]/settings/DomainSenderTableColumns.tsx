'use client'

import { ColumnDef } from '@tanstack/react-table'

export const domainSenderTableColumns: ColumnDef<{
    email: string
    name: string
}>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
]
