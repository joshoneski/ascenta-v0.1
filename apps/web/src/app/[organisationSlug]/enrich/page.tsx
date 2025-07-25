import { ImportContactsDialog } from '@/app/[organisationSlug]/contacts/ImportContactsDialog'
import { BulkEnrichQueue } from '@/app/[organisationSlug]/enrich/BulkEnrichQueue'
import { BulkEnrichReady } from '@/app/[organisationSlug]/enrich/BulkEnrichReady'
import { contactEnrichmentTableColumns } from '@/app/[organisationSlug]/enrich/ContactEnrichmentTableColumns'
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
import { Card } from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { ContactEnrichmentStats } from '@/client/core/components/ContactEnrichmentStats'
import { ContactUploadCard } from '@/client/core/components/ContactUploadCard'
import { getActiveContactEnrichmentJobController } from '@/modules/background-tasks/application/controllers/get-active-contact-enrichment-job.controller'
import { getRecentContactEnrichmentTasksController } from '@/modules/background-tasks/application/controllers/get-recent-contact-enrichment-tasks.controller'
import { getDashboardStatsController } from '@/server/analytics/controllers/get-dashboard-stats.controller'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'
import { UploadIcon } from 'lucide-react'

export default async function Page() {
    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    const [stats, queue, activity] = await Promise.all([
        getDashboardStatsController(organisation.id, user),
        getActiveContactEnrichmentJobController({
            organisationId: organisation.id,
            user,
        }),
        getRecentContactEnrichmentTasksController({
            organisationId: organisation.id,
            user,
        }),
    ])

    const state = (function () {
        if (queue) {
            return 'queued' as const
        } else if (stats.enrichedContacts < stats.totalContacts) {
            return 'enrich' as const
        } else {
            return 'empty' as const
        }
    })()

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
                            <BreadcrumbPage>Data enrich</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader
                    title="Data enrich"
                    rightContent={
                        <ImportContactsDialog organisationId={organisation.id}>
                            <Button>
                                <UploadIcon className="size-4" />
                                <span>Import contacts</span>
                            </Button>
                        </ImportContactsDialog>
                    }
                />

                <div className="space-y-6">
                    {state === 'enrich' ? (
                        <BulkEnrichReady
                            contactsReadyToEnrich={
                                stats.totalContacts - stats.enrichedContacts
                            }
                            organisationId={organisation.id}
                        />
                    ) : null}

                    <ContactEnrichmentStats stats={stats} />

                    {state === 'queued' ? (
                        queue ? (
                            <BulkEnrichQueue
                                enrichedContacts={queue.completed}
                                queuedContacts={queue.total}
                                organisationId={organisation.id}
                            />
                        ) : (
                            <div>
                                Failed to load enrichment queue. Please refresh
                                to try again.
                            </div>
                        )
                    ) : null}

                    {state === 'empty' ? (
                        <ContactUploadCard
                            title="Import your contacts"
                            organisationId={organisation.id}
                        />
                    ) : null}

                    <Card>
                        <DataTable>
                            <DataTableHeader
                                columns={contactEnrichmentTableColumns}
                                data={activity.tasks}
                            />
                            <DataTableBody
                                columns={contactEnrichmentTableColumns}
                                data={activity.tasks}
                            />
                        </DataTable>
                    </Card>
                </div>
            </main>
        </DashboardPage>
    )
}
