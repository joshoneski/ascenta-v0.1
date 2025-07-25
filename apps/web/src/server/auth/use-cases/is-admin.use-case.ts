import { SYSTEM_USER } from '@/server/auth/get-system-auth'
import { organisationsRepo } from '@/server/organisations/organisation.repository'
import { User } from '@/server/server-auth'

/**
 * @deprecated use checkAdminAccess instead
 */
export async function isAdmin(user: User): Promise<boolean> {
    if (user === SYSTEM_USER) {
        return true
    }

    const organisations =
        await organisationsRepo.query.findOrganisationsWithUser(user.id)

    return organisations.some((organisation) => organisation.type === 'admin')
}

export async function checkAdminAccess(userId: string): Promise<boolean> {
    if (userId === SYSTEM_USER.id) {
        return true
    }

    const organisations =
        await organisationsRepo.query.findOrganisationsWithUser(userId)

    return organisations.some((organisation) => organisation.type === 'admin')
}
