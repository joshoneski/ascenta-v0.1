import { SecondaryBodyBackground } from '@/client/components/SecondaryBodyBackground'
import { SelectOrganisationTrigger } from '@/client/components/SelectOrganisationTrigger'
import { SignOutButton } from '@/client/components/SignOutButton'
import { Text } from '@/client/components/Text'
import { Alert, AlertDescription } from '@/client/components/ui/alert'
import { Button, buttonVariants } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { cn } from '@/client/lib/utils'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { ChevronRightIcon, MailIcon, ShieldIcon, UsersIcon } from 'lucide-react'

export default async function Page() {
    const { getOrganisations } = getPageAuth()

    const organisations = await getOrganisations()
    if (organisations.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <Card>
                        <CardHeader className="space-y-4 text-center">
                            <div className="bg-subtle mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                                <ShieldIcon className="text-primary h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">
                                    Invitation Required
                                </CardTitle>
                                <CardDescription className="mt-2 text-base">
                                    You're successfully logged in, but you need
                                    an organization invitation to continue.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Alert>
                                <UsersIcon className="h-4 w-4" />
                                <AlertDescription>
                                    This application is invitation-only. You
                                    must be invited by an organization
                                    administrator to access the platform.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="mb-2 font-medium text-gray-900">
                                        What happens next?
                                    </h3>
                                    <ul className="space-y-2 text-left text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></div>
                                            <span>
                                                Contact your organization
                                                administrator to request access
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></div>
                                            <span>
                                                They will send you an invitation
                                                to join their organization
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></div>
                                            <span>
                                                Once invited, you'll have full
                                                access to the platform
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href="mailto:support@littlephil.org"
                                    className={cn(buttonVariants(), 'w-full')}
                                >
                                    <MailIcon className="mr-2 h-4 w-4" />
                                    <span>Contact Support</span>
                                </a>
                                <SignOutButton asChild>
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                    >
                                        Sign Out
                                    </Button>
                                </SignOutButton>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Contact us at{' '}
                            <a
                                href="mailto:support@littlephil.org"
                                className="text-primary hover:underline"
                            >
                                support@littlephil.org
                            </a>
                        </p>
                    </div>
                </div>

                <SecondaryBodyBackground />
            </div>
        )
    }
    // else if (organisations.length === 1) {
    //     const organisation = organisations.at(0)!
    //     redirect(routes.dashboard.root(organisation.slug))
    // }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Text className="text-gray-900" variant="h1">
                        Select an organisation
                    </Text>
                    <Text className="mt-2 text-gray-600">
                        Choose which organisation you want to access
                    </Text>
                </div>

                <Card className="overflow-hidden">
                    {organisations.map((organisation) => {
                        return (
                            <SelectOrganisationTrigger
                                asChild
                                key={organisation.id}
                                organisationSlug={organisation.slug}
                            >
                                <div className="group flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-50">
                                    <div>
                                        <Text variant="h4">
                                            {organisation.displayName}
                                        </Text>
                                        <Text
                                            className="text-gray-500"
                                            variant="bodyXs"
                                        >
                                            {organisation.type}
                                        </Text>
                                    </div>

                                    <ChevronRightIcon className="transition-all group-hover:translate-x-1" />
                                </div>
                            </SelectOrganisationTrigger>
                        )
                    })}
                </Card>

                <SecondaryBodyBackground />
            </div>
        </div>
    )
}
