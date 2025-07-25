'use client'

import { buttonVariants } from '@/client/components/ui/button'
import { SegmentListItemDTO } from '@/shared/dtos/segment.dto'
import { routes } from '@/shared/routes'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'

export const segmentTableColumns: ColumnDef<
    SegmentListItemDTO & { organisationSlug: string }
>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'contactCount',
        header: 'Contacts',
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ cell }) => {
            const joinedAt = cell.getValue() as SegmentListItemDTO['createdAt']
            return format(new Date(joinedAt), 'dd MMM yyyy')
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <Link
                    className={buttonVariants({ variant: 'secondary' })}
                    href={routes.dashboard.segments.view(
                        row.original.organisationSlug,
                        row.original.id
                    )}
                >
                    View
                </Link>
            )
        },
        meta: {
            style: {
                textAlign: 'right',
            },
        },
    },
]
