'use client'

import { DomainStatusBadge } from '@/app/[organisationSlug]/settings/DomainStatusBadge'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/client/components/ui/tooltip'
import { DomainListItemDTO } from '@/modules/domains'
import { ColumnDef } from '@tanstack/react-table'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

type DomainRecordListItemDTO = DomainListItemDTO['records'][number]

export const domainsRecordsTableColumns: ColumnDef<DomainRecordListItemDTO>[] =
    [
        {
            accessorKey: 'name',
            header: 'Record name',
        },
        {
            accessorKey: 'type',
            header: 'Type',
        },
        {
            accessorKey: 'ttl',
            header: 'TTL',
        },
        {
            accessorKey: 'value',
            header: 'Value',
            cell: ({ cell }) => {
                const value =
                    cell.getValue() as DomainRecordListItemDTO['value']

                function handleCopyToClipboard() {
                    copyToClipboard(value).then(() => {
                        toast.success('Successfully copied to clipboard.')
                    })
                }

                return (
                    <div className="flex max-w-[200px] items-center justify-between gap-2">
                        <span className="min-w-0 grow truncate">{value}</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="shrink-0 p-1"
                                    onClick={handleCopyToClipboard}
                                >
                                    <CopyIcon className="size-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Copy to clipboard
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ cell }) => {
                const status =
                    cell.getValue() as DomainRecordListItemDTO['status']
                return <DomainStatusBadge status={status} />
            },
            meta: {
                style: {
                    textAlign: 'right',
                },
            },
        },
    ]

export const copyToClipboard = (text: string) => {
    // TODO add support for older browsers
    return navigator.clipboard.writeText(text)
}
