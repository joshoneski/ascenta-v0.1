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
import { CampaignCommsClientPage } from '@/client/features/campaigns/pages/CampaignCommsClientPage'
import { campaignsService } from '@/modules/campaigns/application/campaigns.service'
import { getCampaignContentController } from '@/modules/campaigns/application/controllers/get-campaign-content.controller'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'

export const CampaignCommsPage = async (props: {
    params: Promise<{ id: string }>
}) => {
    const params = await props.params

    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors, use toResult?
    const metadata = await campaignsService.getCampaignMetadata({
        id: params.id,
        organisationId: organisation.id,
        user,
    })

    if (metadata.status !== 'draft' || metadata.draftStep !== 'content') {
        redirectToCampaignStep(organisation.slug, params.id, metadata)
    }

    const { emails } = await getCampaignContentController({
        id: params.id,
        organisationId: organisation.id,
        user,
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
                            <BreadcrumbPage>Content</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader title="Content" />

                <CampaignCommsClientPage
                    campaignId={params.id}
                    emails={emails}
                    organisationId={organisation.id}
                    organisationSlug={organisation.slug}
                />
            </main>
        </DashboardPage>
    )
}
