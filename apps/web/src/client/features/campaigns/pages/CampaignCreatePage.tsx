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
import { CampaignCreateClientPage } from '@/client/features/campaigns/pages/CampaignCreateClientPage'
import { domainSendersService } from '@/modules/domains/application/domain-senders.service'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getSegmentOptionsController } from '@/server/segments/controllers/get-segment-options.controller'
import { routes } from '@/shared/routes'

export const CampaignCreatePage = async () => {
    const { buildUserRequestContext, getUserOrRedirect, getOrganisation } =
        getPageAuth()
    const ctx = await buildUserRequestContext()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    const [segments, domainSendersResponse] = await Promise.all([
        getSegmentOptionsController(organisation.id, user),
        domainSendersService.list(ctx, {
            organisationId: organisation.id,
        }),
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
                            <BreadcrumbPage>New campaign</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader title="New campaign" />

                <CampaignCreateClientPage
                    organisationId={organisation.id}
                    organisationSlug={organisation.slug}
                    segments={segments}
                    domainSenders={domainSendersResponse.senders}
                />
            </main>
        </DashboardPage>
    )
}
