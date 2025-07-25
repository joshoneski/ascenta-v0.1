import DashboardHeader from '@/client/components/DashboardHeader'
import { DashboardPage } from '@/client/components/DashboardPage'
import { Text } from '@/client/components/Text'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/client/components/ui/breadcrumb'
import { Card, CardContent } from '@/client/components/ui/card'
import { CampaignDetailsCard } from '@/client/features/campaigns/components/CampaignDetailsCard'
import { CampaignEmailsTimeline } from '@/client/features/campaigns/components/CampaignEmailsTimeline'
import { CampaignStatusBadge } from '@/client/features/campaigns/components/CampaignStatusBadge'
import { GoLiveButton } from '@/client/features/campaigns/components/GoLiveButton'
import { redirectToCampaignStep } from '@/client/features/campaigns/lib/campaign-navigation'
import { campaignsService } from '@/modules/campaigns/application/campaigns.service'
import { getCampaignContentController } from '@/modules/campaigns/application/controllers/get-campaign-content.controller'
import { getCampaignDetailsController } from '@/modules/campaigns/application/controllers/get-campaign-details.controller'
import { getCampaignStatsController } from '@/modules/campaigns/application/controllers/get-campaign-stats.controller'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'
import {
    ActivityIcon,
    MailIcon,
    MousePointerClickIcon,
    UserRoundIcon,
} from 'lucide-react'

export const CampaignDetailsPage = async (props: {
    params: Promise<{ id: string }>
}) => {
    const params = await props.params

    const { buildUserRequestContext, getOrganisation, getUserOrRedirect } =
        getPageAuth()
    const ctx = await buildUserRequestContext()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors, use toResult?
    const metadata = await campaignsService.getCampaignMetadata({
        id: params.id,
        organisationId: organisation.id,
        user,
    })

    if (metadata.status === 'draft' && metadata.draftStep !== 'review') {
        redirectToCampaignStep(organisation.slug, params.id, metadata)
    }

    const [{ emails }, campaignDetails, campaignStats] = await Promise.all([
        getCampaignContentController({
            id: params.id,
            organisationId: organisation.id,
            user,
        }),
        getCampaignDetailsController({
            id: params.id,
            organisationId: organisation.id,
            user,
        }),
        getCampaignStatsController(ctx, {
            id: params.id,
            organisationId: organisation.id,
            user,
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
                            <BreadcrumbPage>Details</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DashboardHeader
                    title={campaignDetails.title}
                    subtitleContent={
                        <div className="mt-2">
                            {metadata.status === 'draft' &&
                            metadata.draftStep === 'review' ? (
                                <GoLiveButton
                                    campaignId={params.id}
                                    organisationId={organisation.id}
                                />
                            ) : null}
                        </div>
                    }
                />

                {/* Campaign stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Text variant="bodySm">Emails Sent</Text>
                                <MailIcon className="text-accent size-5" />
                            </div>
                            <Text variant="h1">
                                {campaignStats.emailsSent.toLocaleString()}
                            </Text>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Text variant="bodySm">Contacts</Text>
                                <UserRoundIcon className="text-accent size-5" />
                            </div>
                            <Text variant="h1">
                                {campaignStats.contactCount.toLocaleString()}
                            </Text>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Text variant="bodySm">Clicks</Text>
                                <MousePointerClickIcon className="text-accent size-5" />
                            </div>
                            <Text variant="h1">
                                {campaignStats.clickCount.toLocaleString()}
                            </Text>
                        </CardContent>
                    </Card>

                    {/*<Card>*/}
                    {/*    <CardContent>*/}
                    {/*        <div className="flex items-center justify-between">*/}
                    {/*            <Text variant="bodySm">Score</Text>*/}
                    {/*            <TrophyIcon className="text-accent size-5" />*/}
                    {/*        </div>*/}
                    {/*        <Text*/}
                    {/*            variant="h1"*/}
                    {/*            className={getCampaignSuccessScoreClassName(*/}
                    {/*                campaignStats.successScore*/}
                    {/*            )}*/}
                    {/*        >*/}
                    {/*            {campaignStats.successScore}*/}
                    {/*        </Text>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Text variant="bodySm">Status</Text>
                                <ActivityIcon className="text-accent size-5" />
                            </div>
                            <div className="mt-2">
                                <CampaignStatusBadge status={metadata.status} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 flex flex-col items-start gap-8 xl:flex-row">
                    {/* Details */}
                    <div className="xl:max-w-[400px]">
                        <Text variant="h2">Details</Text>

                        <div className="mt-2">
                            <CampaignDetailsCard details={campaignDetails} />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1">
                        <Text className="mb-2" variant="h2">
                            Timeline
                        </Text>
                        <CampaignEmailsTimeline
                            campaignId={params.id}
                            emails={emails}
                            organisationId={organisation.id}
                            showImproveButton={false}
                        />
                    </div>
                </div>
            </main>
        </DashboardPage>
    )
}
