import { RequestContext } from '@/server/_utils/request'
import { contactAdapters } from '@/server/contacts/contact.adapter'
import { createContactUseCase } from '@/server/contacts/use-cases/create-contact.use-case'

export async function createContactController(
    ctx: RequestContext,
    input: {
        email: string
        firstName?: string | null | undefined
        lastName?: string | null | undefined
        organisationId: string
    }
) {
    const contact = await createContactUseCase(ctx, input)

    return contactAdapters.entityToDTO(contact)
}
