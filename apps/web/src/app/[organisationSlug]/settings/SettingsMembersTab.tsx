'use client'

import { membersTableColumns } from '@/app/[organisationSlug]/settings/MembersTableColumns'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { useOrganisationMembers } from '@/client/queries/organisations'
import { ReactNode } from 'react'

export const SettingsMembersTab = (props: { organisationId: string }) => {
    const members = useOrganisationMembers({
        organisation: props.organisationId,
    })

    let content: ReactNode = null

    if (members.isPending) {
        content = <p>Loading...</p>
    } else if (members.isError || !members.data) {
        content = <p>Error</p>
    } else {
        content = (
            <DataTable>
                <DataTableHeader
                    columns={membersTableColumns}
                    data={members.data}
                />
                <DataTableBody
                    columns={membersTableColumns}
                    data={members.data}
                />
            </DataTable>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                    Manage who has access to your team.
                </CardDescription>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    )
}
