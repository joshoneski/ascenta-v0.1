import { ContactEnrichmentScoreBadge } from '@/app/[organisationSlug]/contacts/[id]/ContactEnrichmentScoreBadge'
import { ContactEmailStatusBadge } from '@/client/components/ContactEmailStatusBadge'
import { RelativeDate } from '@/client/components/RelativeDate'
import { Text } from '@/client/components/Text'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { EmailStatus } from '@/server/contacts/contact.types'
import {
    AwardIcon,
    BuildingIcon,
    ChartNoAxesColumnIcon,
    MailIcon,
    MapPinIcon,
    UserRoundIcon,
    UserRoundPlusIcon,
} from 'lucide-react'

const unknownPlaceholder = 'Not available'

export const ContactInfoCard = (props: {
    className?: string
    contactId: string
    contactEmail: string
    contactFirstName: string | null
    contactLastName: string | null
    contactName: string
    contactLocation: string | null
    contactCompany: string | null
    contactProfession: string | null
    contactEnrichmentScore: number | null
    contactCreatedAt: Date
    emailStatus: EmailStatus
    organisationSlug: string
}) => {
    let fullName = ''
    if (props.contactFirstName) {
        fullName += props.contactFirstName
        if (props.contactLastName) {
            fullName += ` ${props.contactLastName}`
        }
    }

    return (
        <Card className={props.className}>
            <CardHeader>
                <CardTitle>Info</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <ChartNoAxesColumnIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <Text variant="h4">Data score</Text>
                            <ContactEnrichmentScoreBadge
                                score={props.contactEnrichmentScore ?? 0}
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <MailIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Text variant="h4">Email</Text>
                                <ContactEmailStatusBadge
                                    emailStatus={props.emailStatus}
                                />
                            </div>
                            <Text className="text-muted-foreground">
                                {props.contactEmail}
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <UserRoundIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <Text variant="h4">Name</Text>
                            <Text className="text-muted-foreground">
                                {fullName || unknownPlaceholder}
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPinIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <Text variant="h4">Location</Text>
                            <Text className="text-muted-foreground">
                                {props.contactLocation || unknownPlaceholder}
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <BuildingIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <Text variant="h4">Company</Text>
                            <Text className="text-muted-foreground">
                                {props.contactCompany || unknownPlaceholder}
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AwardIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <Text variant="h4">Profession</Text>
                            <Text className="text-muted-foreground">
                                {props.contactProfession || unknownPlaceholder}
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <UserRoundPlusIcon className="mt-0.5 h-4 w-4" />
                        <div className="flex-1">
                            <Text variant="h4">Created</Text>
                            <Text className="text-muted-foreground">
                                <RelativeDate date={props.contactCreatedAt} />
                            </Text>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
