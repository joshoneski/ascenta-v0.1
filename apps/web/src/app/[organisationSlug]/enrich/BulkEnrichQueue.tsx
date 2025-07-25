'use client'

import { Text } from '@/client/components/Text'
import { Card, CardContent } from '@/client/components/ui/card'
import { Progress } from '@/client/components/ui/progress'
import { RefreshCwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const BulkEnrichQueue = (props: {
    enrichedContacts: number
    queuedContacts: number
    organisationId: string
}) => {
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 1000)

        return () => clearInterval(interval)
    }, [router])

    return (
        <Card className="border-muted bg-muted">
            <CardContent>
                <div className="flex items-center gap-2">
                    <RefreshCwIcon className="size-5 animate-spin" />
                    <Text variant="h4">Enrichment queue</Text>
                </div>
                <Text className="mt-2" variant="h1">
                    <span className="text-primary">
                        {props.enrichedContacts.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                        /{props.queuedContacts.toLocaleString()}
                    </span>
                </Text>
                <Progress
                    className="mt-2"
                    value={
                        (props.enrichedContacts / props.queuedContacts) * 100
                    }
                />
            </CardContent>
        </Card>
    )
}
