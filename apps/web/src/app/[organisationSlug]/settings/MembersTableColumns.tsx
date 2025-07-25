'use client'

import { OrganisationMemberListItemDTO } from '@/shared/dtos/organisation.dto'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export const membersTableColumns: ColumnDef<OrganisationMemberListItemDTO>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ cell }) => {
            const joinedAt =
                cell.getValue() as OrganisationMemberListItemDTO['createdAt']
            return format(new Date(joinedAt), 'dd MMM yyyy')
        },
    },
]
