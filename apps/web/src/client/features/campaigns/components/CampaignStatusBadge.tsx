import { Badge } from '@/client/components/ui/badge'
import { CampaignStatus } from '@/modules/campaigns'

export const CampaignStatusBadge = (props: { status: CampaignStatus }) => {
    const status = props.status
    if (status === 'running') {
        return <Badge className="bg-success text-white">Running</Badge>
    } else if (status === 'paused') {
        return <Badge className="bg-warning text-white">Paused</Badge>
    } else if (status === 'finished') {
        return <Badge className="bg-gray-500 text-white">Finished</Badge>
    } else {
        return <Badge className="bg-gray-200 text-gray-700">Draft</Badge>
    }
}