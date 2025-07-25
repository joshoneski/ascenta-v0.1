'use client'

import { ContactEmailStatusBadge } from '@/client/components/ContactEmailStatusBadge'
import { buttonVariants } from '@/client/components/ui/button'
import { ContactListItemDTO } from '@/shared/dtos/contact.dto'
import { routes } from '@/shared/routes'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const contactTableColumns: ColumnDef<
    ContactListItemDTO & { organisationSlug: string }
>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'emailStatus',
        header: 'Verification',
        cell: ({ cell }) => {
            const emailStatus =
                cell.getValue() as ContactListItemDTO['emailStatus']
            return (
                <ContactEmailStatusBadge
                    emailStatus={emailStatus ?? 'unverified'}
                />
            )
        },
    },
    {
        accessorKey: 'firstName',
        header: 'First name',
        cell: ({ cell }) => {
            const firstName = cell.getValue() as ContactListItemDTO['firstName']
            return (
                <div>
                    {firstName ? (
                        <span>{firstName}</span>
                    ) : (
                        <span className="text-neutral-400">None</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'lastName',
        header: 'Last name',
        cell: ({ cell }) => {
            const lastName = cell.getValue() as ContactListItemDTO['lastName']
            return (
                <div>
                    {lastName ? (
                        <span>{lastName}</span>
                    ) : (
                        <span className="text-neutral-400">None</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <Link
                    className={buttonVariants({ variant: 'secondary' })}
                    href={routes.dashboard.contacts.view(
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
