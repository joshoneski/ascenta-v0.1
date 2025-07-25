import { Container } from '@/client/components/Container'
import { DashboardSidebar } from '@/client/components/DashboardSidebar'
import { SelectOrganisationTrigger } from '@/client/components/SelectOrganisationTrigger'
import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import { SidebarProvider } from '@/client/components/ui/sidebar'
import { AuthProvider } from '@/client/context/AuthContext'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Layout(props: { children?: React.ReactNode }) {
    const { getUserOrRedirect, getOrganisation, getOrganisations } =
        getPageAuth()

    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()
    const organisations = await getOrganisations()

    const previousOrganisation = organisations.at(0)
    if (!previousOrganisation) {
        redirect(routes.organisations)
    }

    return (
        <AuthProvider organisation={organisation}>
            <SidebarProvider>
                <DashboardSidebar organisation={organisation} user={user} />
                <div className="w-full">
                    {organisation.temp ? (
                        <div className="sticky top-0 z-10 bg-white pt-4">
                            <Container>
                                <div className="bg-primary text-primary-foreground flex w-full items-center justify-between rounded-lg p-2 pl-4">
                                    <Text variant="h4">
                                        Acting on behalf of &#34;
                                        {organisation.displayName}
                                        &#34;.
                                    </Text>
                                    <SelectOrganisationTrigger
                                        asChild
                                        organisationSlug={
                                            previousOrganisation.slug
                                        }
                                    >
                                        <Button variant="secondary">
                                            Return to your account...
                                        </Button>
                                    </SelectOrganisationTrigger>
                                </div>
                            </Container>
                        </div>
                    ) : null}

                    {props.children}

                    {/*    <div className="mt-4 rounded-lg border p-4">*/}
                    {/*        <h1 className="text-2xl">Server Layout</h1>*/}
                    {/*        <pre>*/}
                    {/*            {JSON.stringify(*/}
                    {/*                { admin, organisation, organisations },*/}
                    {/*                null,*/}
                    {/*                4*/}
                    {/*            )}*/}
                    {/*        </pre>*/}
                    {/*    </div>*/}

                    {/*    <div className="mt-4 rounded-lg border p-4">*/}
                    {/*        <h1 className="text-2xl">Client</h1>*/}
                    {/*        <pre>*/}
                    {/*            <ClientAuth />*/}
                    {/*        </pre>*/}
                    {/*    </div>*/}
                </div>
            </SidebarProvider>
        </AuthProvider>
    )
}
