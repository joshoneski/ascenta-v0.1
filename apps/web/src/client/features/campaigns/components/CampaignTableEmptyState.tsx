import { BusinessPresentationIllustration } from '@/client/components/illustrations/BusinessPresentationIllustration'
import { Text } from '@/client/components/Text'
import { buttonVariants } from '@/client/components/ui/button'
import { Card, CardContent } from '@/client/components/ui/card'
import { routes } from '@/shared/routes'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export const CampaignTableEmptyState = (props: {
    organisationSlug: string
}) => {
    return (
        <Card>
            <CardContent className="py-10 text-center">
                <BusinessPresentationIllustration className="text-primary mx-auto" />

                <Text as="h2" className="mt-2" variant="h1">
                    Start your first smart campaign
                </Text>
                <Text className="text-muted-foreground">
                    Let our AI tailor your campaign! It’ll only takes a couple
                    of minutes.
                </Text>

                <Link
                    className={
                        'mt-6 ' +
                        buttonVariants({
                            variant: 'accent',
                        })
                    }
                    href={routes.dashboard.campaigns.create(
                        props.organisationSlug
                    )}
                >
                    <span>Get started</span>
                    <ArrowRightIcon className="size-4" />
                </Link>
            </CardContent>
        </Card>
    )
}
