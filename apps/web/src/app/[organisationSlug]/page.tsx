import CharityDashboardPage from '@/app/[organisationSlug]/CharityDashboardPage'
import DashboardHeader from '@/client/components/DashboardHeader'
import { DashboardPage } from '@/client/components/DashboardPage'
import { getPageAuth } from '@/server/auth/get-page-auth'

export default async function Page() {
    const { getOrganisation } = getPageAuth()
    const organisation = await getOrganisation()

    return (
        <DashboardPage>
            <main>
                <DashboardHeader title="Home" />

                {organisation.type === 'charity' ? (
                    <CharityDashboardPage />
                ) : null}
            </main>
        </DashboardPage>
    )
}
