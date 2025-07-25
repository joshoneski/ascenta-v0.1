import { Text } from '@/client/components/Text'
import { Card, CardContent } from '@/client/components/ui/card'
import { CampaignDetailsDTO } from '@/shared/dtos/campaign.dto'
import {
    DicesIcon,
    LinkIcon,
    PenIcon,
    TargetIcon,
    UsersRoundIcon,
} from 'lucide-react'

interface CampaignDetailsCardProps {
    details: CampaignDetailsDTO
}

export const CampaignDetailsCard = (props: CampaignDetailsCardProps) => {
    return (
        <Card>
            <CardContent className="space-y-6 p-4">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <PenIcon className="size-4" />
                        <Text variant="h4">Title</Text>
                    </div>
                    <Text className="text-sm">{props.details.title}</Text>
                </div>

                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <UsersRoundIcon className="size-4" />
                        <Text variant="h4">Segment</Text>
                    </div>
                    <Text className="text-sm">
                        {props.details.segmentName || 'All Contacts'}
                    </Text>
                </div>

                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <TargetIcon className="size-4" />
                        <Text variant="h4">Summary</Text>
                    </div>
                    <Text className="text-sm">{props.details.summary}</Text>
                </div>

                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <DicesIcon className="size-4" />
                        <Text variant="h4">Strategy</Text>
                    </div>
                    <Text className="text-sm">{props.details.strategy}</Text>
                </div>

                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <LinkIcon className="size-4" />
                        <Text variant="h4">Donation link</Text>
                    </div>
                    <Text className="text-sm break-all">
                        {props.details.ctaUrl}
                    </Text>
                </div>
            </CardContent>
        </Card>
    )
}
