'use client'

import { buttonVariants } from '@/client/components/ui/button'
import { CampaignStatusBadge } from '@/client/features/campaigns/components/CampaignStatusBadge'
import { CampaignListItemDTO } from '@/modules/campaigns/campaigns.types'
import { routes } from '@/shared/routes'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const campaignTableColumns: ColumnDef<
    CampaignListItemDTO & { organisationSlug: string }
>[] = [
    {
        accessorKey: 'title',
        header: 'Campaign',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ cell }) => {
            const status = cell.getValue() as CampaignListItemDTO['status']
            return <CampaignStatusBadge status={status} />
        },
    },
    {
        accessorKey: 'contactCount',
        header: 'Contacts',
        cell: ({ cell }) => {
            const count = cell.getValue() as CampaignListItemDTO['contactCount']
            return count.toLocaleString()
        },
    },
    {
        accessorKey: 'emailsSent',
        header: 'Emails sent',
        cell: ({ cell }) => {
            const count = cell.getValue() as CampaignListItemDTO['emailsSent']
            return count.toLocaleString()
        },
    },
    {
        accessorKey: 'clickCount',
        header: 'Clicks',
        cell: ({ cell }) => {
            const count = cell.getValue() as CampaignListItemDTO['clickCount']
            return count.toLocaleString()
        },
    },
    // {
    //     accessorKey: 'successScore',
    //     header: 'Score',
    //     cell: ({ cell }) => {
    //         const score = cell.getValue() as CampaignListItemDTO['successScore']
    //         return (
    //             <span className={getCampaignSuccessScoreClassName(score)}>
    //                 {score}
    //             </span>
    //         )
    //     },
    // },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <Link
                    className={buttonVariants({ variant: 'secondary' })}
                    href={routes.dashboard.campaigns.view(
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
