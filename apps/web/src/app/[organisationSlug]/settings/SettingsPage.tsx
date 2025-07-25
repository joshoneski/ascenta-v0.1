import { SettingsBrandingTab } from '@/app/[organisationSlug]/settings/SettingsBrandingTab'
import { SettingsDomainsTab } from '@/app/[organisationSlug]/settings/SettingsDomainsTab'
import { SettingsGeneralTab } from '@/app/[organisationSlug]/settings/SettingsGeneralTab'
import { SettingsMembersTab } from '@/app/[organisationSlug]/settings/SettingsMembersTab'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/client/components/ui/tabs'
import {
    GlobeIcon,
    PaletteIcon,
    SettingsIcon,
    UsersRoundIcon,
} from 'lucide-react'
import { ReactNode } from 'react'

export const SettingsPage = (props: {
    organisationId: string
    organisationSlug: string
    organisationType: 'admin' | 'charity' // TODO: use type
}) => {
    return (
        <Tabs className="flex-row items-start" defaultValue="general">
            <TabsList className="w-full max-w-[250px] flex-col bg-transparent">
                <SettingsTabsTrigger value="general">
                    <SettingsIcon />
                    <span>General</span>
                </SettingsTabsTrigger>
                <SettingsTabsTrigger value="members">
                    <UsersRoundIcon />
                    <span>Members</span>
                </SettingsTabsTrigger>
                {props.organisationType === 'charity' ? (
                    <>
                        <SettingsTabsTrigger value="domains">
                            <GlobeIcon />
                            <span>Domains</span>
                        </SettingsTabsTrigger>
                        <SettingsTabsTrigger value="branding">
                            <PaletteIcon />
                            <span>Branding</span>
                        </SettingsTabsTrigger>
                        {/*<SettingsTabsTrigger value="billing">*/}
                        {/*    <CreditCardIcon />*/}
                        {/*    <span>Billing</span>*/}
                        {/*</SettingsTabsTrigger>*/}
                    </>
                ) : null}
            </TabsList>

            <TabsContent value="general">
                <SettingsGeneralTab organisationId={props.organisationId} />
            </TabsContent>

            <TabsContent value="members">
                <SettingsMembersTab organisationId={props.organisationId} />
            </TabsContent>

            {props.organisationType === 'charity' ? (
                <>
                    <TabsContent value="domains">
                        <SettingsDomainsTab
                            organisationId={props.organisationId}
                        />
                    </TabsContent>

                    <TabsContent value="branding">
                        <SettingsBrandingTab
                            organisationId={props.organisationId}
                        />
                    </TabsContent>

                    {/*<TabsContent value="billing">*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle>Billing & Usage</CardTitle>*/}
                    {/*            <CardDescription>*/}
                    {/*                Manage your subscription and view usage*/}
                    {/*                statistics.*/}
                    {/*            </CardDescription>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent>*/}
                    {/*            <ul>*/}
                    {/*                <li>Display current plan</li>*/}
                    {/*                <li>Display payment method</li>*/}
                    {/*                <li>Link to Stripe</li>*/}
                    {/*            </ul>*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*</TabsContent>*/}
                </>
            ) : null}
        </Tabs>
    )
}

const SettingsTabsTrigger = (props: {
    children?: ReactNode
    value: string
}) => {
    return (
        <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-foreground data-[state=inactive]:hover:bg-muted w-full justify-start py-2 transition-none"
            value={props.value}
        >
            {props.children}
        </TabsTrigger>
    )
}
