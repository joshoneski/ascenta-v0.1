import { Badge } from '@/client/components/ui/badge'

export const ContactEnrichmentScoreBadge = (props: { score: number }) => {
    return (
        <Badge className={getScoreBadgeClassName(props.score)}>
            {props.score}
        </Badge>
    )
}

function getScoreBadgeClassName(score: number) {
    if (score >= 80) {
        return 'bg-success'
    } else if (score >= 40) {
        return 'bg-warning'
    } else {
        return 'bg-danger'
    }
}
