import { ContactEnrichTab } from '@/app/[organisationSlug]/contacts/[id]/ContactEnrichTab'
import { ContactOverviewTab } from '@/app/[organisationSlug]/contacts/[id]/ContactOverviewTab'
import DashboardHeader from '@/client/components/DashboardHeader'
import { DashboardPage } from '@/client/components/DashboardPage'
import { Text } from '@/client/components/Text'
import { Avatar, AvatarFallback } from '@/client/components/ui/avatar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/client/components/ui/breadcrumb'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/client/components/ui/tabs'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getContactDetailsController } from '@/server/contacts/controllers/get-contact-details.controller'
import { routes } from '@/shared/routes'
import { SparklesIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    const { getOrganisation, getUserOrRedirect } = getPageAuth()
    const user = await getUserOrRedirect()
    const organisation = await getOrganisation()

    // TODO: handle thrown errors
    const contact = await getContactDetailsController(
        params.id,
        organisation.id,
        user
    )

    if (!contact) {
        redirect(routes.dashboard.contacts.root(organisation.slug))
    }

    let name = contact.email
    let initials = contact.email.charAt(0)
    if (contact.firstName) {
        name = contact.firstName
        initials = contact.firstName.charAt(0)
        if (contact.lastName) {
            name += ` ${contact.lastName}`
            initials += contact.lastName.charAt(0)
        }
    }

    const creationDate = new Date(contact.createdAt)

    return (
        <DashboardPage>
            <main>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={routes.dashboard.root(organisation.slug)}
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={routes.dashboard.contacts.root(
                                    organisation.slug
                                )}
                            >
                                Contacts
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Contact Details</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="mb-6 flex items-center gap-5">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback>
                            <Text variant="h2">{initials.toUpperCase()}</Text>
                        </AvatarFallback>
                    </Avatar>
                    <DashboardHeader className="mb-0" title={name} />
                </div>

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="enrich">
                            <span>Enrich</span> <SparklesIcon />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <ContactOverviewTab
                            contactId={contact.id}
                            contactEmail={contact.email}
                            contactFirstName={contact.firstName ?? null}
                            contactLastName={contact.lastName ?? null}
                            contactName={name}
                            contactLocation={contact.location ?? null}
                            contactCompany={contact.company ?? null}
                            contactProfession={contact.profession ?? null}
                            contactEnrichmentScore={
                                contact.enrichmentScore ?? null
                            }
                            contactIsEnriched={contact.isEnriched}
                            contactCreatedAt={creationDate}
                            emailStatus={contact.emailStatus}
                            organisationSlug={organisation.slug}
                        />
                    </TabsContent>

                    <TabsContent value="enrich">
                        <ContactEnrichTab
                            contactId={contact.id}
                            contactEmail={contact.email}
                            contactFirstName={contact.firstName ?? null}
                            contactLastName={contact.lastName ?? null}
                            contactName={name}
                            contactLocation={contact.location ?? null}
                            contactCompany={contact.company ?? null}
                            contactProfession={contact.profession ?? null}
                            contactEnrichmentScore={
                                contact.enrichmentScore ?? null
                            }
                            contactIsEnriched={contact.isEnriched}
                            contactCreatedAt={creationDate}
                            emailStatus={contact.emailStatus}
                            organisationId={organisation.id}
                            organisationSlug={organisation.slug}
                        />
                    </TabsContent>
                </Tabs>
            </main>
        </DashboardPage>
    )
}

const capitaliseFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
