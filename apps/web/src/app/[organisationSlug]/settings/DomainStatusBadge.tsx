import { Badge } from '@/client/components/ui/badge'
import { capitaliseFirstLetter } from '@/shared/string'

export const DomainStatusBadge = (props: { status: string }) => {
    const status = props.status

    switch (status) {
        case 'not_started':
            return <Badge className="bg-gray-500 text-white">Not started</Badge>
        case 'pending':
            return <Badge className="bg-warning text-white">Pending</Badge>
        case 'verified':
            return <Badge className="bg-success text-white">Verified</Badge>
        case 'failed':
        case 'temporary_failure':
            return <Badge className="bg-danger text-white">Failed</Badge>
        default:
            return (
                <Badge className="bg-gray-200 text-gray-700">
                    {capitaliseFirstLetter(status).replace('_', ' ')}
                </Badge>
            )
    }
}
