import { getPageAuth } from '@/server/auth/get-page-auth'
import { routes } from '@/shared/routes'
import { redirect } from 'next/navigation'

export default async function Home() {
    const { getUser } = getPageAuth()

    const user = await getUser()
    if (user) {
        redirect(routes.organisations)
    }

    redirect(routes.login)
}
