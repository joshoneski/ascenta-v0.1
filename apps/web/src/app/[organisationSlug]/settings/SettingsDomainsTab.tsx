'use client'

import { CreateDomainDialog } from '@/app/[organisationSlug]/settings/CreateDomainDialog'
import { DomainSettingsCard } from '@/app/[organisationSlug]/settings/DomainSettingsCard'
import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { useDomains } from '@/client/queries/domains'
import { LoaderCircle, PlusCircleIcon } from 'lucide-react'
import { ReactNode } from 'react'

export const SettingsDomainsTab = (props: { organisationId: string }) => {
    const domains = useDomains(
        {
            organisation: props.organisationId,
        },
        {
            refetchInterval: (query) => {
                if (!query.state.data) {
                    return false
                }

                const hasPendingDomain = query.state.data.domains.some(
                    (domain) => domain.status === 'pending'
                )

                // If any domain is pending, refetch every 5s
                return hasPendingDomain ? 5000 : false
            },
        }
    )

    let content: ReactNode = null
    if (domains.isLoading) {
        content = (
            <div className="flex h-[100px] items-center justify-center">
                <LoaderCircle className="size-12 animate-spin" />
            </div>
        )
    } else if (!domains.data) {
        content = (
            <div>Oops! Something went wrong. Please refresh the page.</div>
        )
    } else {
        if (domains.data.domains.length === 0) {
            content = (
                <div>
                    <CreateDomainDialog organisationId={props.organisationId}>
                        <Button>
                            <span>Add your first domain</span>
                            <PlusCircleIcon className="size-4" />
                        </Button>
                    </CreateDomainDialog>
                </div>
            )
        } else {
            content = (
                <div>
                    {domains.data.domains.map((domain) => {
                        return (
                            <DomainSettingsCard
                                key={domain.id}
                                domain={domain}
                                organisationId={props.organisationId}
                            />
                        )
                    })}
                </div>
            )
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Domains</CardTitle>
                <CardDescription>
                    Manage your custom domains for emails.
                </CardDescription>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    )
}
