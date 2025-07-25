import { contactTableColumns } from '@/app/[organisationSlug]/contacts/ContactTableColumns'
import DashboardHeader from '@/client/components/DashboardHeader'
import { DashboardPage } from '@/client/components/DashboardPage'
import { PaginationBlock } from '@/client/components/PaginationBlock'
import { Badge } from '@/client/components/ui/badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/client/components/ui/breadcrumb'
import { Card, CardContent } from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getSegmentContactsController } from '@/server/segments/controllers/get-segment-contacts.controller'
import { getSegmentDetailsController } from '@/server/segments/controllers/get-segment-details.controller'
import {
    SEGMENT_FIELD_LABELS,
    SEGMENT_OPERATOR_LABELS,
} from '@/shared/dtos/segment.dto'
import { routes } from '@/shared/routes'
import { redirect } from 'next/navigation'

export default async function Page(props: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ page?: number }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const page = Math.max(1, searchParams.page ?? 1)

    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors
    const segment = await getSegmentDetailsController(
        params.id,
        organisation.id,
        user
    )

    if (!segment) {
        redirect(routes.dashboard.segments.root(organisation.slug))
    }

    const contacts = await getSegmentContactsController(
        page,
        params.id,
        organisation.id,
        user
    )

    const normalaisedContacts = contacts.contacts.map((contact) => {
        return {
            ...contact,
            organisationSlug: organisation.slug,
        }
    })

    return (
        <DashboardPage>
            <main>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={routes.dashboard.root(organisation.slug)}
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbLink
                            href={routes.dashboard.segments.root(
                                organisation.slug
                            )}
                        >
                            Segments
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader title={segment.name} />

                <div className="flex space-x-2">
                    {segment.filters.map((filter) => {
                        const field =
                            SEGMENT_FIELD_LABELS[
                                filter.field as keyof typeof SEGMENT_FIELD_LABELS
                            ]
                        const operator =
                            SEGMENT_OPERATOR_LABELS[
                                filter.operator as keyof typeof SEGMENT_OPERATOR_LABELS
                            ]

                        return (
                            <Badge
                                key={filter.id}
                                className="text-sm"
                                variant="secondary"
                            >
                                {field} {operator} {filter.value as any}
                            </Badge>
                        )
                    })}
                </div>

                <Card className="mt-4">
                    <CardContent className="p-0">
                        <DataTable>
                            <DataTableHeader
                                columns={contactTableColumns}
                                data={normalaisedContacts}
                            />
                            <DataTableBody
                                columns={contactTableColumns}
                                data={normalaisedContacts}
                            />
                        </DataTable>
                    </CardContent>
                </Card>
                <PaginationBlock
                    className="mt-4"
                    page={contacts.meta.page}
                    pageCount={contacts.meta.pageCount}
                />
            </main>
        </DashboardPage>
    )
}
