'use client'

import { ContactEnrichmentJobBadge } from '@/app/[organisationSlug]/enrich/ContactEnrichmentJobBadge'
import { ContactEnrichmentListItemDTO } from '@/modules/background-tasks/contact-enrichment-job.type'
import { ColumnDef } from '@tanstack/react-table'

export const contactEnrichmentTableColumns: ColumnDef<ContactEnrichmentListItemDTO>[] =
    [
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ cell }) => {
                const status =
                    cell.getValue() as ContactEnrichmentListItemDTO['status']
                return <ContactEnrichmentJobBadge status={status} />
            },
        },
        {
            accessorKey: 'contact.email',
            header: 'Email',
        },
        {
            accessorKey: 'firstName',
            header: 'First name',
            cell: ({ cell }) => {
                const firstName =
                    cell.getValue() as ContactEnrichmentListItemDTO['contact']['firstName']
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
                const lastName =
                    cell.getValue() as ContactEnrichmentListItemDTO['contact']['lastName']
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
    ]
