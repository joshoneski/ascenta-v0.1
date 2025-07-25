import { isAdmin } from '@/server/auth/use-cases/is-admin.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'

export class AuthContext {
    private _isAdmin: boolean | null = null
    private _organisation: string | null
    private _user: UserDTO | null

    constructor(ctx: { organisation: string | null; user: UserDTO | null }) {
        this._organisation = ctx.organisation
        this._user = ctx.user
    }

    attachUser(user: UserDTO) {
        this._user = user
    }

    attachOrganisation(organisationId: string) {
        this._organisation = organisationId
    }

    async isAdmin() {
        if (typeof this._isAdmin === 'boolean') {
            return this._isAdmin
        } else if (!this._user) {
            return false
        }

        return isAdmin(this._user)
    }

    get user() {
        return this._user
    }

    get organisation() {
        return this._organisation
    }
}
