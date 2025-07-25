'use client'

import { Button } from '@/client/components/ui/button'
import { CampaignEmailDTO } from '@/modules/campaigns'
import { routes } from '@/shared/routes'
import { ArrowRightIcon, LoaderCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCompleteCampaignContent } from '../hooks/campaigns'
import { CampaignEmailsTimeline } from '../components/CampaignEmailsTimeline'

export const CampaignCommsClientPage = (props: {
    campaignId: string
    emails: CampaignEmailDTO[]
    organisationId: string
    organisationSlug: string
}) => {
    const completeContent = useCompleteCampaignContent()
    const router = useRouter()

    async function handleCompleteContent() {
        await completeContent.mutateAsync({
            body: {},
            campaign: props.campaignId,
            organisation: props.organisationId,
        })
        router.push(
            routes.dashboard.campaigns.view(
                props.organisationSlug,
                props.campaignId
            )
        )
    }

    return (
        <div>
            <CampaignEmailsTimeline
                campaignId={props.campaignId}
                emails={props.emails}
                organisationId={props.organisationId}
            />

            <Button
                className="mt-6"
                variant="accent"
                onClick={handleCompleteContent}
                disabled={completeContent.isPending}
            >
                <span>Looks good</span>
                {completeContent.isPending ? (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                    <ArrowRightIcon className="size-4" />
                )}
            </Button>
        </div>
    )
}
