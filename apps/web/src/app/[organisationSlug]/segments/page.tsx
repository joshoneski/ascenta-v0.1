import { segmentTableColumns } from '@/app/[organisationSlug]/segments/SegmentTableColumns'
import DashboardHeader from '@/client/components/DashboardHeader'
import { DashboardPage } from '@/client/components/DashboardPage'
import { PaginationBlock } from '@/client/components/PaginationBlock'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/client/components/ui/breadcrumb'
import { buttonVariants } from '@/client/components/ui/button'
import { Card, CardContent } from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getSegmentsController } from '@/server/segments/controllers/get-segments.controller'
import { routes } from '@/shared/routes'
import { PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'

export default async function Page(props: {
    searchParams: Promise<{ page?: number }>
}) {
    const searchParams = await props.searchParams
    const page = Math.max(1, searchParams.page ?? 1)

    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors, use toResult?
    // TODO: return pagination data
    const { segments, meta } = await getSegmentsController(
        page,
        organisation.id,
        user
    )

    const normalaisedSegments = segments.map((segment) => {
        return {
            ...segment,
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
                        <BreadcrumbItem>
                            <BreadcrumbPage>Segments</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader
                    title="Segments"
                    rightContent={
                        <Link
                            className={buttonVariants()}
                            href={routes.dashboard.segments.create(
                                organisation.slug
                            )}
                        >
                            <PlusCircleIcon className="size-4" />
                            <span>Create</span>
                        </Link>
                    }
                />

                <Card>
                    <CardContent className="p-0">
                        <DataTable>
                            <DataTableHeader
                                columns={segmentTableColumns}
                                data={normalaisedSegments}
                            />
                            <DataTableBody
                                columns={segmentTableColumns}
                                data={normalaisedSegments}
                            />
                        </DataTable>
                    </CardContent>
                </Card>
                <PaginationBlock
                    className="mt-4"
                    page={meta.page}
                    pageCount={meta.pageCount}
                />
            </main>
        </DashboardPage>
    )
}
