import { contactTableColumns } from '@/app/[organisationSlug]/contacts/ContactTableColumns'
import { CreateContactDialog } from '@/app/[organisationSlug]/contacts/CreateContactDialog'
import { ExportContactsDialog } from '@/app/[organisationSlug]/contacts/ExportContactsDialog'
import { ImportContactsDialog } from '@/app/[organisationSlug]/contacts/ImportContactsDialog'
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
import { Button } from '@/client/components/ui/button'
import { Card, CardContent } from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getOrganisationContactsController } from '@/server/contacts/controllers/get-organisation-contacts.controller'
import { routes } from '@/shared/routes'
import { DownloadIcon, PlusCircleIcon, UploadIcon } from 'lucide-react'

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
    const { contacts, meta } = await getOrganisationContactsController(
        page,
        organisation.id,
        user
    )

    const normalaisedContacts = contacts.map((contact) => {
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
                        <BreadcrumbItem>
                            <BreadcrumbPage>Contacts</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader
                    title="Contacts"
                    rightContent={
                        <div className="flex gap-2">
                            <ExportContactsDialog
                                organisationId={organisation.id}
                            >
                                <Button variant="secondary">
                                    <DownloadIcon className="size-4" />
                                    <span>Export</span>
                                </Button>
                            </ExportContactsDialog>

                            <ImportContactsDialog
                                organisationId={organisation.id}
                            >
                                <Button variant="secondary">
                                    <UploadIcon className="size-4" />
                                    <span>Import</span>
                                </Button>
                            </ImportContactsDialog>

                            <CreateContactDialog
                                organisationId={organisation.id}
                            >
                                <Button>
                                    <PlusCircleIcon className="size-4" />
                                    <span>Create</span>
                                </Button>
                            </CreateContactDialog>
                        </div>
                    }
                />

                <Card>
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
                    page={meta.page}
                    pageCount={meta.pageCount}
                />
            </main>
        </DashboardPage>
    )
}
