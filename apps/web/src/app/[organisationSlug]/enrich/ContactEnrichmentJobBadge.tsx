import { Badge } from '@/client/components/ui/badge'
import { ContactEnrichmentTaskStatus } from '@/modules/background-tasks/contact-enrichment-job.type'
import { capitaliseFirstLetter } from '@/shared/string'

export const ContactEnrichmentJobBadge = (props: {
    status: ContactEnrichmentTaskStatus
}) => {
    return (
        <Badge className={getBadgeClassName(props.status)}>
            {capitaliseFirstLetter(props.status)}
        </Badge>
    )
}

function getBadgeClassName(status: ContactEnrichmentTaskStatus) {
    if (status === 'completed') {
        return 'bg-success text-white'
    } else if (status === 'failed') {
        return 'bg-danger text-white'
    } else if (status === 'processing') {
        return 'bg-blue-500 text-white'
    } else {
        return 'bg-gray-200 text-foreground'
    }
}
