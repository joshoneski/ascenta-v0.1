import { Text } from '@/client/components/Text'
import { buttonVariants } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { ContactEnrichmentStats } from '@/client/core/components/ContactEnrichmentStats'
import { ContactUploadCard } from '@/client/core/components/ContactUploadCard'
import { campaignTableColumns } from '@/client/features/campaigns/components/CampaignTableColumns'
import { campaignsService } from '@/modules/campaigns'
import { getDashboardStatsController } from '@/server/analytics/controllers/get-dashboard-stats.controller'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export default async function CharityDashboardPage() {
    const { buildUserRequestContext, getUserOrRedirect, getOrganisation } =
        getPageAuth()
    const ctx = await buildUserRequestContext()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    const [{ campaigns }, stats] = await Promise.all([
        campaignsService.getCampaigns(ctx, {
            organisationId: organisation.id,
            user,
        }),
        getDashboardStatsController(organisation.id, user),
    ])

    const normalaisedCampaigns = campaigns.map((campaign) => {
        return {
            ...campaign,
            organisationSlug: organisation.slug,
        }
    })

    return (
        <div className="space-y-6">
            <ContactEnrichmentStats stats={stats} />

            <Card>
                <CardHeader className="border-b pb-6">
                    <CardTitle>Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable>
                        <DataTableHeader
                            columns={campaignTableColumns}
                            data={normalaisedCampaigns}
                        />

                        {normalaisedCampaigns.length > 0 ? (
                            <DataTableBody
                                columns={campaignTableColumns}
                                data={normalaisedCampaigns}
                            />
                        ) : null}
                    </DataTable>

                    {normalaisedCampaigns.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <Text as="h2" className="mt-2" variant="h1">
                                Start your first smart campaign
                            </Text>
                            <Text className="text-muted-foreground">
                                Let our AI tailor your campaign! It’ll only
                                takes a couple of minutes.
                            </Text>

                            <Link
                                className={
                                    'mt-6 ' +
                                    buttonVariants({
                                        variant: 'accent',
                                    })
                                }
                                href={routes.dashboard.campaigns.create(
                                    organisation.slug
                                )}
                            >
                                <span>Get started</span>
                                <ArrowRightIcon className="size-4" />
                            </Link>
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Import your contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContactUploadCard
                        title={null}
                        organisationId={organisation.slug}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
