import { Text } from '@/client/components/Text'
import { Card, CardContent, CardTitle } from '@/client/components/ui/card'
import { AlertCircleIcon } from 'lucide-react'

export const ContactMissingInformationCard = (props: {
    contactId: string
    organisationSlug: string
}) => {
    return (
        <Card className="bg-primary text-primary-foreground border-primary text-sm">
            <CardContent>
                <CardTitle className="flex items-center font-medium">
                    <AlertCircleIcon className="mr-2 h-6 w-6" />
                    <Text variant="h2">Missing info</Text>
                </CardTitle>
                <Text className="mt-2">
                    Enrich your contact to fill vital information and build
                    better marketing communications.
                </Text>
                {/*<Link*/}
                {/*    className={cn(*/}
                {/*        buttonVariants({ variant: 'subtle' }),*/}
                {/*        'mt-6'*/}
                {/*    )}*/}
                {/*    href={routes.dashboard.contacts.enrich(*/}
                {/*        props.organisationSlug,*/}
                {/*        props.contactId*/}
                {/*    )}*/}
                {/*>*/}
                {/*    <SparklesIcon className="h-4 w-4" />*/}
                {/*    <span>Enrich</span>*/}
                {/*</Link>*/}
            </CardContent>
        </Card>
    )
}
