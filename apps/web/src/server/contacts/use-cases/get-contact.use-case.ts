import { RequestContext } from '@/server/_utils/request'
import { ContactId } from '@/server/contacts/contact.entity'
import { contactsRepo } from '@/server/contacts/contact.repository'
import { ForbiddenError } from '@/shared/errors'

export async function getContactUseCase(
    ctx: RequestContext,
    contactId: ContactId
) {
    const contact = await contactsRepo.query.findById(contactId)

    if (ctx.actor.type === 'system') {
        return contact
    }

    if (ctx.organisation?.id !== contact.organisationId.value) {
        throw new ForbiddenError(
            'You do not have permission to access this contact.'
        )
    }

    return contact
}
