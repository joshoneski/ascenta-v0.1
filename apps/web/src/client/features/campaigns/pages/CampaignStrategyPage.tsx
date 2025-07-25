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
import { redirectToCampaignStep } from '@/client/features/campaigns/lib/campaign-navigation'
import { CampaignStrategyClientPage } from '@/client/features/campaigns/pages/CampaignStrategyClientPage'
import { campaignsService } from '@/modules/campaigns/application/campaigns.service'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getSegmentOptionsController } from '@/server/segments/controllers/get-segment-options.controller'
import { routes } from '@/shared/routes'

export const CampaignStrategyPage = async (props: {
    params: Promise<{ id: string }>
}) => {
    const params = await props.params
    const campaignId = params.id

    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors, use toResult?
    const metadata = await campaignsService.getCampaignMetadata({
        id: campaignId,
        organisationId: organisation.id,
        user,
    })

    if (metadata.status !== 'draft' || metadata.draftStep !== 'strategy') {
        redirectToCampaignStep(organisation.slug, campaignId, metadata)
    }

    const [details, segments] = await Promise.all([
        campaignsService.getCampaignDetails({
            id: campaignId,
            organisationId: organisation.id,
            user,
        }),
        getSegmentOptionsController(organisation.id, user),
    ])

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
                            <BreadcrumbLink
                                href={routes.dashboard.campaigns.root(
                                    organisation.slug
                                )}
                            >
                                Campaigns
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={routes.dashboard.campaigns.create(
                                    organisation.slug
                                )}
                            >
                                New campaign
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Strategy</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader title="Strategy" />

                <CampaignStrategyClientPage
                    campaignDetails={details}
                    campaignId={campaignId}
                    organisationId={organisation.id}
                    organisationSlug={organisation.slug}
                />
            </main>
        </DashboardPage>
    )
}
