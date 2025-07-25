import { RequestContext } from '@/server/_utils/request'
import { contactsRepo } from '@/server/contacts/contact.repository'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { ForbiddenError } from '@/shared/errors'

export async function upsertManyContactsUseCase(
    ctx: RequestContext,
    input: {
        email: string
        firstName?: string | null | undefined
        lastName?: string | null | undefined
    }[],
    organisation: OrganisationEntity
) {
    if (ctx.organisation?.id !== organisation.id.value) {
        throw new ForbiddenError('You do not have access to this organisation.')
    }

    return contactsRepo.mutate.upsertMany(organisation.id, input)
}
