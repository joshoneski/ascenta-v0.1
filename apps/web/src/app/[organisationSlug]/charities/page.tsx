import { CreateOrganisationDialog } from '@/app/[organisationSlug]/charities/CreateOrganisationDialog'
import { organisationTableColumns } from '@/app/[organisationSlug]/charities/OrganisationTableColumns'
import { DashboardCard } from '@/client/components/DashboardCard'
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
import { Button } from '@/client/components/ui/button'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { organisationAdapters } from '@/server/organisations/organisation.adapter'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { routes } from '@/shared/routes'
import { PlusCircleIcon } from 'lucide-react'

export default async function Page() {
    const { getOrganisation } = getPageAuth()
    const organisation = await getOrganisation()

    // TODO: add auth check, check orgCapabilities
    // TODO: replace with controller
    const organisationEntities =
        await organisationsRepo.query.findByType('charity')

    const organisations = organisationEntities.map(
        organisationAdapters.entityToDTO
    )

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
                            <BreadcrumbPage>Charities</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader
                    title="Charities"
                    rightContent={
                        <CreateOrganisationDialog>
                            <Button>
                                <PlusCircleIcon className="size-4" />
                                <span>Create</span>
                            </Button>
                        </CreateOrganisationDialog>
                    }
                />

                <DashboardCard className="p-0">
                    <DataTable>
                        <DataTableHeader
                            columns={organisationTableColumns}
                            data={organisations}
                        />
                        <DataTableBody
                            columns={organisationTableColumns}
                            data={organisations}
                        />
                    </DataTable>
                </DashboardCard>
            </main>
        </DashboardPage>
    )
}
