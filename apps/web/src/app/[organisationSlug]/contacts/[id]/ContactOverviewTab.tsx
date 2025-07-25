import { ContactActivityFeed } from '@/app/[organisationSlug]/contacts/[id]/ContactActivityFeed'
import { ContactInfoCard } from '@/app/[organisationSlug]/contacts/[id]/ContactInfoCard'
import { ContactMissingInformationCard } from '@/app/[organisationSlug]/contacts/[id]/ContactMissingInformationCard'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { EmailStatus } from '@/server/contacts/contact.types'
import { LoaderCircleIcon } from 'lucide-react'
import { Suspense } from 'react'

export const ContactOverviewTab = (props: {
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
    organisationSlug: string
}) => {
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

            <Card className="md:col-span-7">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Track all interactions with this contact
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense
                        fallback={
                            <div className="flex h-[200px] items-center justify-center">
                                <LoaderCircleIcon className="size-12 animate-spin" />
                            </div>
                        }
                    >
                        <ContactActivityFeed contactId={props.contactId} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
