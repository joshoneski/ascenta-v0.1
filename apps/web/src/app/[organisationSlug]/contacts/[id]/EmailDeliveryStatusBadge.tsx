import { Badge } from '@/client/components/ui/badge'
import { CampaignEmailDeliveryStatus } from '@/modules/campaigns'

export const EmailDeliveryStatusBadge = (props: {
    status: CampaignEmailDeliveryStatus | (string & {})
}) => {
    const status = props.status
    if (status === 'sent') {
        return <Badge className="bg-success text-white">Sent</Badge>
    } else if (status === 'failed') {
        return <Badge className="bg-danger text-white">Failed</Badge>
    } else if (status === 'processing') {
        return <Badge className="bg-warning text-white">Processing</Badge>
    } else if (status === 'scheduled') {
        return <Badge className="bg-blue-500 text-white">Scheduled</Badge>
    } else {
        return <Badge className="bg-gray-200 text-gray-700">Unverified</Badge>
    }
}
