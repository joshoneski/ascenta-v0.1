import { SegmentCreateForm } from '@/app/[organisationSlug]/segments/create/SegmentCreateForm'
import DashboardHeader from '@/client/components/DashboardHeader'
import { DashboardPage } from '@/client/components/DashboardPage'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/client/components/ui/breadcrumb'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'

export default async function Page(props: {
    searchParams: Promise<{ page?: number }>
}) {
    const searchParams = await props.searchParams
    const page = Math.max(1, searchParams.page ?? 1)

    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

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
                            <BreadcrumbPage>Create</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader title="Create segments" />

                <SegmentCreateForm
                    organisationId={organisation.id}
                    organisationSlug={organisation.slug}
                />
            </main>
        </DashboardPage>
    )
}
