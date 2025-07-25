'use client'

import { Text } from '@/client/components/Text'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/client/components/ui/sidebar'
import { useIsMobile } from '@/client/hooks/use-mobile'
import { OrganisationDTO } from '@/shared/dtos/organisation.dto'
import { UserDTO } from '@/shared/dtos/user.dto'
import { routes } from '@/shared/routes'
import {
    AudioLinesIcon,
    HeartHandshakeIcon,
    HomeIcon,
    MailIcon,
    SettingsIcon,
    SparklesIcon,
    UserRoundIcon,
    UsersRoundIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CALL_CENTER_URL = 'https://konverter.lomeai.com:8888'

export const DashboardSidebar = (props: {
    organisation: OrganisationDTO
    user: UserDTO
}) => {
    const pathname = usePathname()
    const isMobile = useIsMobile()

    return (
        <Sidebar
            collapsible="icon"
            side={isMobile ? 'right' : 'left'}
            variant="floating"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/*<DropdownMenu>*/}
                        {/*    <DropdownMenuTrigger asChild>*/}
                        <SidebarMenuButton
                            asChild
                            // className="cursor-pointer hover:bg-[#E0E0E0]"
                            size="lg"
                        >
                            <Link
                                href={routes.dashboard.root(
                                    props.organisation.slug
                                )}
                            >
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                    <h1 className="text-lg">
                                        {props.organisation.displayName.charAt(
                                            0
                                        )}
                                    </h1>
                                </div>
                                <span>{props.organisation.displayName}</span>
                            </Link>
                            {/*<ChevronsUpDownIcon className="ml-auto" />*/}
                        </SidebarMenuButton>
                        {/*</DropdownMenuTrigger>*/}
                        {/*<DropdownMenuContent className="w-[234px]">*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <span>*/}
                        {/*            {props.organisation.displayName}*/}
                        {/*        </span>*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <PlusIcon className="text-inherit" />*/}
                        {/*        <span>Create organisation</span>*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*</DropdownMenuContent>*/}
                        {/*</DropdownMenu>*/}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/*<SidebarGroup>*/}
                {/*    <SidebarGroupContent>*/}
                {/*        <SidebarMenu>*/}
                {/*            <Collapsible className="group/collapsible">*/}
                {/*                <SidebarMenuItem>*/}
                {/*                    <CollapsibleTrigger asChild>*/}
                {/*                        <SidebarMenuButton asChild>*/}
                {/*                            <Link*/}
                {/*                                href={routes.dashboard.contacts.root(*/}
                {/*                                    props.organisation.slug*/}
                {/*                                )}*/}
                {/*                            >*/}
                {/*                                <UserRoundIcon className="size-8" />*/}
                {/*                                <span>Contacts</span>*/}
                {/*                            </Link>*/}
                {/*                        </SidebarMenuButton>*/}
                {/*                    </CollapsibleTrigger>*/}
                {/*                    <CollapsibleContent>*/}
                {/*                        <SidebarMenuSub>*/}
                {/*                            <SidebarMenuSubItem>*/}
                {/*                                <SidebarMenuButton>*/}
                {/*                                    All contacts*/}
                {/*                                </SidebarMenuButton>*/}
                {/*                            </SidebarMenuSubItem>*/}
                {/*                            <SidebarMenuSubItem>*/}
                {/*                                <SidebarMenuButton>*/}
                {/*                                    Segments*/}
                {/*                                </SidebarMenuButton>*/}
                {/*                            </SidebarMenuSubItem>*/}
                {/*                        </SidebarMenuSub>*/}
                {/*                    </CollapsibleContent>*/}
                {/*                </SidebarMenuItem>*/}
                {/*            </Collapsible>*/}
                {/*        </SidebarMenu>*/}
                {/*    </SidebarGroupContent>*/}
                {/*</SidebarGroup>*/}

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname ===
                                        routes.dashboard.root(
                                            props.organisation.slug
                                        )
                                    }
                                >
                                    <Link
                                        href={routes.dashboard.root(
                                            props.organisation.slug
                                        )}
                                    >
                                        <HomeIcon />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {props.organisation.type === 'admin' ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(
                                            routes.dashboard.charities.root(
                                                props.organisation.slug
                                            )
                                        )}
                                    >
                                        <Link
                                            href={routes.dashboard.charities.root(
                                                props.organisation.slug
                                            )}
                                        >
                                            <HeartHandshakeIcon />
                                            <span>Charities</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}

                            {props.organisation.type === 'charity' ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(
                                            routes.dashboard.contacts.root(
                                                props.organisation.slug
                                            )
                                        )}
                                    >
                                        <Link
                                            href={routes.dashboard.contacts.root(
                                                props.organisation.slug
                                            )}
                                        >
                                            <UserRoundIcon />
                                            <span>Contacts</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}

                            {props.organisation.type === 'charity' ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            pathname ===
                                            routes.dashboard.segments.root(
                                                props.organisation.slug
                                            )
                                        }
                                    >
                                        <Link
                                            href={routes.dashboard.segments.root(
                                                props.organisation.slug
                                            )}
                                        >
                                            <UsersRoundIcon />
                                            <span>Segments</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}

                            {props.organisation.type === 'charity' ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(
                                            routes.dashboard.enrich.root(
                                                props.organisation.slug
                                            )
                                        )}
                                    >
                                        <Link
                                            href={routes.dashboard.enrich.root(
                                                props.organisation.slug
                                            )}
                                        >
                                            <SparklesIcon />
                                            <span>Data enrich</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}

                            {props.organisation.type === 'charity' ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(
                                            routes.dashboard.campaigns.root(
                                                props.organisation.slug
                                            )
                                        )}
                                    >
                                        <Link
                                            href={routes.dashboard.campaigns.root(
                                                props.organisation.slug
                                            )}
                                        >
                                            <MailIcon />
                                            <span>Campaigns</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}

                            {props.organisation.type === 'charity' ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={CALL_CENTER_URL}
                                            target="_blank"
                                        >
                                            <AudioLinesIcon />
                                            <span>Call Center</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith(
                                routes.dashboard.settings.root(
                                    props.organisation.slug
                                )
                            )}
                        >
                            <Link
                                href={routes.dashboard.settings.root(
                                    props.organisation.slug
                                )}
                            >
                                <SettingsIcon />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <Link href={routes.organisations}>
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                    <h1 className="text-lg">
                                        {props.user.name.charAt(0)}
                                    </h1>
                                </div>
                                <div>
                                    <Text className="text-foreground">
                                        {props.user.name}
                                    </Text>
                                    <Text
                                        className="text-foreground"
                                        variant="bodyXs"
                                    >
                                        {props.organisation.displayName}
                                    </Text>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
