import { SettingsPage } from '@/app/[organisationSlug]/settings/SettingsPage'
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

export default async function Page() {
    const { getOrganisation } = getPageAuth()
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
                        <BreadcrumbItem>
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader title="Settings" />

                <SettingsPage
                    organisationId={organisation.id}
                    organisationSlug={organisation.slug}
                    organisationType={organisation.type}
                />
            </main>
        </DashboardPage>
    )
}
