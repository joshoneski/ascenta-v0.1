import { Text } from '@/client/components/Text'
import { Card, CardContent } from '@/client/components/ui/card'
import { OrganisationContactStatsDTO } from '@/shared/dtos/analytics.dto'
import {
    CheckCircleIcon,
    SparklesIcon,
    TrendingUpIcon,
    UserRoundIcon,
} from 'lucide-react'

export const ContactEnrichmentStats = ({
    stats,
}: {
    stats: OrganisationContactStatsDTO
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Text variant="bodySm">Total Contacts</Text>
                        <UserRoundIcon className="text-accent size-5" />
                    </div>
                    <Text variant="h1">{stats.totalContacts}</Text>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Text variant="bodySm">Enriched Contacts</Text>
                        <SparklesIcon className="text-accent size-5" />
                    </div>
                    <Text variant="h1">{stats.enrichedContacts}</Text>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Text variant="bodySm">Verified Contacts</Text>
                        <CheckCircleIcon className="text-accent size-5" />
                    </div>
                    <Text variant="h1">{stats.verifiedContacts}</Text>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Text variant="bodySm">Enrichment Rate</Text>
                        <TrendingUpIcon className="text-accent size-5" />
                    </div>
                    <Text
                        variant="h1"
                        className={getEnrichmentRateClassName(
                            stats.enrichmentRate * 100
                        )}
                    >
                        {Math.floor(stats.enrichmentRate * 100)}%
                    </Text>
                </CardContent>
            </Card>
        </div>
    )
}

function getEnrichmentRateClassName(rate: number) {
    if (rate >= 80) {
        return 'text-success'
    } else if (rate >= 40) {
        return 'text-warning'
    } else {
        return 'text-danger'
    }
}
