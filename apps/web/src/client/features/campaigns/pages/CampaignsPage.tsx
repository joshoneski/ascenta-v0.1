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
import { campaignTableColumns } from '@/client/features/campaigns/components/CampaignTableColumns'
import { CampaignTableEmptyState } from '@/client/features/campaigns/components/CampaignTableEmptyState'
import { campaignsService } from '@/modules/campaigns/application/campaigns.service'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export const CampaignsPage = async (props: {
    searchParams: Promise<{ page?: number }>
}) => {
    const searchParams = await props.searchParams
    const page = Math.max(1, searchParams.page ?? 1)

    const { buildUserRequestContext, getOrganisation, getUserOrRedirect } =
        getPageAuth()
    const ctx = await buildUserRequestContext()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors, use toResult?
    const { campaigns, meta } = await campaignsService.getCampaigns(ctx, {
        page,
        organisationId: organisation.id,
        user,
    })

    const normalaisedCampaigns = campaigns.map((campaign) => {
        return {
            ...campaign,
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
                            <BreadcrumbPage>Campaigns</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader
                    title="Campaigns"
                    rightContent={
                        <Link
                            className={buttonVariants({
                                size: 'sm',
                                variant: 'accent',
                            })}
                            href={routes.dashboard.campaigns.create(
                                organisation.slug
                            )}
                        >
                            <PlusIcon className="size-4" />
                            <span>New</span>
                        </Link>
                    }
                />

                {normalaisedCampaigns.length ? (
                    <>
                        <Card>
                            <CardContent className="p-0">
                                <DataTable>
                                    <DataTableHeader
                                        columns={campaignTableColumns}
                                        data={normalaisedCampaigns}
                                    />
                                    <DataTableBody
                                        columns={campaignTableColumns}
                                        data={normalaisedCampaigns}
                                    />
                                </DataTable>
                            </CardContent>
                        </Card>
                        <PaginationBlock
                            className="mt-4"
                            page={meta.page}
                            pageCount={meta.pageCount}
                        />
                    </>
                ) : (
                    <CampaignTableEmptyState
                        organisationSlug={organisation.slug}
                    />
                )}
            </main>
        </DashboardPage>
    )
}
