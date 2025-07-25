import 'server-only'

import { RequestContext } from '@/server/_utils/request'
import { UserDTO } from '@/shared/dtos/user.dto'

// NOTE: This is a hack to allow controllers to be called from Inngress functions.
//  We should use an Actor which has a type of system or user, however this requires
//  a bunch of controllers and use-cases to be updated.
export const SYSTEM_USER: UserDTO = {
    id: 'system',
    email: 'dev@socialimpactgroup.com',
    name: 'Inngress',
}

export function getSystemAuth() {
    return {
        buildSystemRequestContext,
        getSystemUser,
    }
}

async function getSystemUser(): Promise<UserDTO> {
    return SYSTEM_USER
}

function buildSystemRequestContext(
    id: 'inngress',
    source: 'cron' | 'job'
): RequestContext {
    return {
        actor: {
            id,
            orgIds: [],
            type: 'system',
        },
        organisation: null,
        requestId: crypto.randomUUID(),
        source,
    }
}
