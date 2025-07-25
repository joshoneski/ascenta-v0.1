import { RequestContext } from '@/server/_utils/request'
import { contactsRepo } from '@/server/contacts/contact.repository'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { ForbiddenError } from '@/shared/errors'

export async function createContactUseCase(
    ctx: RequestContext,
    input: {
        email: string
        firstName?: string | null | undefined
        lastName?: string | null | undefined
        organisationId: string
    }
) {
    if (ctx.organisation?.id !== input.organisationId) {
        throw new ForbiddenError('You do not have access to this organisation.')
    }

    return contactsRepo.mutate.create({
        email: input.email,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        organisationId: new OrganisationId(input.organisationId),
    })
}
