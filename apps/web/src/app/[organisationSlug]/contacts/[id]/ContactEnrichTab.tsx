'use client'

import { ContactInfoCard } from '@/app/[organisationSlug]/contacts/[id]/ContactInfoCard'
import { ContactMissingInformationCard } from '@/app/[organisationSlug]/contacts/[id]/ContactMissingInformationCard'
import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { ApiError } from '@/client/lib/api'
import {
    useContactEnrichmentDetails,
    useEnrichContact,
} from '@/client/queries/contacts'
import { EmailStatus } from '@/server/contacts/contact.types'
import {
    BookHeartIcon,
    LoaderCircleIcon,
    OctagonXIcon,
    PlugZapIcon,
    SparklesIcon,
    TargetIcon,
    UserRoundIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { toast } from 'sonner'

const unknownPlaceholder = 'Not available'

export const ContactEnrichTab = (props: {
    contactId: string
    contactEmail: string
    contactFirstName: string | null
    contactLastName: string | null
    contactName: string
    contactLocation: string | null
    contactCompany: string | null
    contactProfession: string | null
    contactEnrichmentScore: number | null
    contactIsEnriched: boolean
    contactCreatedAt: Date
    emailStatus: EmailStatus
    organisationId: string
    organisationSlug: string
}) => {
    const router = useRouter()

    const enrichedContact = useContactEnrichmentDetails({
        contact: props.contactId,
        organisation: props.organisationId,
    })

    const enrichContact = useEnrichContact()

    const handleEnrichClick = async () => {
        if (enrichedContact.isLoading) {
            return
        }

        try {
            await enrichContact.mutateAsync({
                contact: props.contactId,
                organisation: props.organisationId,
            })
            router.refresh()
            toast.success('Contact successfully enriched.')
        } catch (e: unknown) {
            if (e instanceof ApiError) {
                toast.error(e.message)
            } else {
                toast.error('Failed to enrich contact.')
            }
        }
    }

    let content: ReactNode = null
    if (enrichedContact.isPending) {
        content = (
            <Card>
                <CardContent>
                    <CardTitle>Loading...</CardTitle>
                </CardContent>
            </Card>
        )
    } else if (!enrichedContact.data) {
        if (enrichContact.isPending) {
            content = (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-32">
                        <Text variant="h1">Enriching contact!</Text>
                        <Text className="text-muted-foreground">
                            Sit back and watch the magic happen...
                        </Text>
                        <Button className="mt-6" variant="accent">
                            <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                            <span>Enriching</span>
                        </Button>
                    </CardContent>
                </Card>
            )
        } else {
            content = (
                <Card>
                    <CardHeader>
                        <CardTitle>Enrich to get started</CardTitle>
                        <CardDescription>
                            Enrich your customer’s details now and start
                            improving your campaign outreach.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="accent" onClick={handleEnrichClick}>
                            <SparklesIcon className="h-4 w-4" />
                            <span>Enrich</span>
                        </Button>
                    </CardContent>
                </Card>
            )
        }
    } else {
        content = (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <EnrichedField
                            icon={<UserRoundIcon className="h-4 w-4" />}
                            title="Persona"
                            value={
                                enrichedContact.data.summary ? (
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {enrichedContact.data.summary}
                                    </pre>
                                ) : (
                                    unknownPlaceholder
                                )
                            }
                        />

                        <EnrichedField
                            icon={<PlugZapIcon className="h-4 w-4" />}
                            title="Motivations"
                            value={
                                enrichedContact.data.motivations ? (
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {enrichedContact.data.motivations}
                                    </pre>
                                ) : (
                                    unknownPlaceholder
                                )
                            }
                        />

                        <EnrichedField
                            icon={<TargetIcon className="h-4 w-4" />}
                            title="Communication Style"
                            value={
                                enrichedContact.data.communicationStyle ? (
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {
                                            enrichedContact.data
                                                .communicationStyle
                                        }
                                    </pre>
                                ) : (
                                    unknownPlaceholder
                                )
                            }
                        />

                        <EnrichedField
                            icon={<OctagonXIcon className="h-4 w-4" />}
                            title="Potential Objections"
                            value={
                                enrichedContact.data.potentialObjections ? (
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {
                                            enrichedContact.data
                                                .potentialObjections
                                        }
                                    </pre>
                                ) : (
                                    unknownPlaceholder
                                )
                            }
                        />

                        <EnrichedField
                            icon={<BookHeartIcon className="h-4 w-4" />}
                            title="Engagement Suggestions"
                            value={
                                enrichedContact.data.engagementSuggestions ? (
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {
                                            enrichedContact.data
                                                .engagementSuggestions
                                        }
                                    </pre>
                                ) : (
                                    unknownPlaceholder
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid items-start gap-8 md:grid-cols-12">
            <div className="space-y-8 md:col-span-5">
                <ContactInfoCard
                    contactId={props.contactId}
                    contactEmail={props.contactEmail}
                    contactFirstName={props.contactFirstName}
                    contactLastName={props.contactLastName}
                    contactName={props.contactName}
                    contactLocation={props.contactLocation}
                    contactCompany={props.contactCompany}
                    contactProfession={props.contactProfession}
                    contactEnrichmentScore={props.contactEnrichmentScore}
                    contactCreatedAt={props.contactCreatedAt}
                    emailStatus={props.emailStatus}
                    organisationSlug={props.organisationSlug}
                />

                {!props.contactIsEnriched ? (
                    <ContactMissingInformationCard
                        contactId={props.contactId}
                        organisationSlug={props.organisationSlug}
                    />
                ) : null}
            </div>

            <div className="md:col-span-7">{content}</div>
        </div>
    )
}

const EnrichedField = (props: {
    icon: ReactNode
    title: string
    value: string | ReactNode
}) => {
    return (
        <div>
            <div className="flex items-center gap-2">
                {props.icon}
                <Text variant="h4">{props.title}</Text>
            </div>
            <Text>{props.value}</Text>
        </div>
    )
}
