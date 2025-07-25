import { Badge } from '@/client/components/ui/badge'

export const ContactEmailStatusBadge = (props: {
    emailStatus: 'invalid' | 'processing' | 'valid' | 'unverified'
}) => {
    const status = props.emailStatus
    if (status === 'valid') {
        return <Badge className="bg-success text-white">Verified</Badge>
    } else if (status === 'invalid') {
        return <Badge className="bg-danger text-white">Invalid</Badge>
    } else if (status === 'processing') {
        return <Badge className="bg-warning text-white">Processing</Badge>
    } else {
        return <Badge className="bg-gray-200 text-gray-700">Unverified</Badge>
    }
}
