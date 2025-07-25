'use client'

import { MultiStepLoader } from '@/client/components/MultiStepLoader'
import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import { PopoverInput } from '@/client/core/components/forms/PopoverInput'
import { PopoverTextarea } from '@/client/core/components/forms/PopoverTextarea'
import {
    useCompleteCampaignStrategy,
    useUpdateCampaign,
} from '@/client/features/campaigns/hooks/campaigns'
import { CampaignDetailsDTO } from '@/shared/dtos/campaign.dto'
import { routes } from '@/shared/routes'
import {
    ArrowRightIcon,
    DicesIcon,
    PencilIcon,
    PenIcon,
    TargetIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const CampaignStrategyClientPage = (props: {
    campaignDetails: CampaignDetailsDTO
    campaignId: string
    organisationId: string
    organisationSlug: string
}) => {
    const [isRouting, startRouterTransition] = useTransition()

    const router = useRouter()
    const completeCampaignStrategy = useCompleteCampaignStrategy()
    const updateCampaign = useUpdateCampaign()

    async function handleValueChange(
        key: 'title' | 'strategy' | 'summary',
        value: string
    ) {
        await updateCampaign.mutateAsync({
            body: {
                [key]: value,
            },
            campaign: props.campaignId,
            organisation: props.organisationId,
        })

        router.refresh()
    }

    async function handleComplete() {
        await completeCampaignStrategy.mutateAsync({
            body: {},
            campaign: props.campaignId,
            organisation: props.organisationId,
        })

        startRouterTransition(() => {
            router.push(
                routes.dashboard.campaigns.draft.comms(
                    props.organisationSlug,
                    props.campaignId
                )
            )
        })
    }

    return (
        <div className="max-w-[500px]">
            <div className="flex items-start gap-4">
                <div className="grow">
                    <div className="flex items-center gap-2">
                        <PenIcon className="size-4" />
                        <Text variant="h4">Title</Text>
                    </div>
                    <Text className="text-muted-foreground">
                        {props.campaignDetails.title}
                    </Text>
                </div>
                <PopoverInput
                    defaultValue={props.campaignDetails.title}
                    label="Title"
                    placeholder="Enter campaign title"
                    onSave={(value) => handleValueChange('title', value)}
                >
                    <div>
                        <EditButton />
                    </div>
                </PopoverInput>
            </div>

            <div className="mt-6 flex items-start gap-4">
                <div className="grow">
                    <div className="flex items-center gap-2">
                        <TargetIcon className="size-4" />
                        <Text variant="h4">Summary</Text>
                    </div>
                    <Text className="text-muted-foreground">
                        {props.campaignDetails.summary}
                    </Text>
                </div>
                <PopoverTextarea
                    defaultValue={props.campaignDetails.summary}
                    label="Summary"
                    placeholder="Enter campaign summary"
                    onSave={(value) => handleValueChange('summary', value)}
                >
                    <div>
                        <EditButton />
                    </div>
                </PopoverTextarea>
            </div>

            <div className="mt-6 flex items-start gap-4">
                <div className="grow">
                    <div className="flex items-center gap-2">
                        <DicesIcon className="size-4" />
                        <Text variant="h4">Strategy</Text>
                    </div>
                    <Text className="text-muted-foreground">
                        {props.campaignDetails.strategy}
                    </Text>
                </div>
                <PopoverTextarea
                    defaultValue={props.campaignDetails.strategy}
                    label="Strategy"
                    placeholder="Enter campaign strategy"
                    onSave={(value) => handleValueChange('strategy', value)}
                >
                    <div>
                        <EditButton />
                    </div>
                </PopoverTextarea>
            </div>

            <Button className="mt-6" variant="accent" onClick={handleComplete}>
                <span>Looks good</span>
                <ArrowRightIcon className="size-4" />
            </Button>

            <MultiStepLoader
                isLoading={completeCampaignStrategy.isPending || isRouting}
                steps={[
                    { text: 'Analyzing strategy', duration: 5000 },
                    { text: 'Finalizing strategy', duration: 5000 },
                    { text: 'Generating email sequence', duration: 5000 },
                ]}
            />
        </div>
    )
}

const EditButton = () => {
    return (
        <div className="border-primary text-primary cursor-pointer rounded-full border p-1">
            <PencilIcon className="size-4 stroke-1" />
        </div>
    )
}
