'use client'

import { SelectOrganisationTrigger } from '@/client/components/SelectOrganisationTrigger'
import { Button } from '@/client/components/ui/button'
import { OrganisationDTO } from '@/shared/dtos/organisation.dto'
import { ColumnDef } from '@tanstack/react-table'

export const organisationTableColumns: ColumnDef<OrganisationDTO>[] = [
    {
        accessorKey: 'displayName',
        header: 'Name',
    },
    {
        accessorKey: 'id',
        header: 'Identifier',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'actions',
        header: () => null,
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    <SelectOrganisationTrigger
                        asChild
                        organisationSlug={row.original.slug}
                    >
                        <Button className="ml-auto" variant="secondary">
                            Switch
                        </Button>
                    </SelectOrganisationTrigger>
                </div>
            )
        },
        meta: {
            style: {
                textAlign: 'right',
            },
        },
    },
]
