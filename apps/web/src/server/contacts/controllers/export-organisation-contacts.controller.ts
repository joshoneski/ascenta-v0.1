import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { ContactExportListItemDTO } from '@/shared/dtos/contact.dto'
import { UserDTO } from '@/shared/dtos/user.dto'
import { contactsReadRepo } from '../contact-read-repository'

export async function exportOrganisationContactsCsvController(
    organisationId: string,
    user: UserDTO
): Promise<ReturnType<typeof presenter>> {
    const organisation = await getOrganisationUseCase(organisationId, user)

    const contacts = await contactsReadRepo.getContactExportDetails(
        organisation.id
    )

    return presenter(contacts)
}

function presenter(contacts: ContactExportListItemDTO[]) {
    const data = [
        [
            'Email',
            'First Name',
            'Last Name',
            'Email Status',
            'City',
            'State',
            'Country',
            'Company',
            'Profession',
        ].join(','),
    ]

    for (const contact of contacts) {
        data.push(
            [
                contact.email,
                contact.firstName || '',
                contact.lastName || '',
                contact.emailStatus || 'unverified',
                contact.city || '',
                contact.region || '',
                contact.country || '',
                contact.company || '',
                contact.profession || '',
            ].join(',')
        )
    }

    return data.join('\n')
}
