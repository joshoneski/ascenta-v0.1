import { RequestContext } from '@/server/_utils/request'
import { upsertManyContactsUseCase } from '@/server/contacts/use-cases/upsert-many-contacts.use-case'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { UserDTO } from '@/shared/dtos/user.dto'
import { BadRequestError } from '@/shared/errors'

const BATCH_SIZE = 100

export async function importContactsController(
    ctx: RequestContext,
    csvData: string[][],
    organisationId: string,
    user: UserDTO
) {
    const [headerRow, ...contactRows] = csvData
    if (!headerRow) {
        throw new Error('Empty CSV provided.')
    }

    let createdCount = 0
    let updatedCount = 0

    const emailIndex = getHeaderIndexOrThrow(headerRow, 'Email')
    const firstNameIndex = getHeaderIndex(headerRow, 'First name')
    const lastNameIndex = getHeaderIndex(headerRow, 'Last name')

    const organisation = await getOrganisationUseCase(organisationId, user)

    for (let batch = 0; batch < contactRows.length / BATCH_SIZE; batch++) {
        const start = batch * BATCH_SIZE
        const end = start + BATCH_SIZE
        const rows = contactRows.slice(start, end)

        const contacts: {
            email: string
            firstName?: string | null | undefined
            lastName?: string | null | undefined
        }[] = []

        for (const row of rows) {
            const email = row[emailIndex]
            if (!email) {
                throw new BadRequestError('Missing email.')
            }

            const contact: {
                email: string
                firstName?: string | null | undefined
                lastName?: string | null | undefined
            } = {
                email,
            }

            if (isValidHeaderIndex(firstNameIndex) && row[firstNameIndex!]) {
                contact.firstName = row[firstNameIndex!]
            }
            if (isValidHeaderIndex(lastNameIndex) && row[lastNameIndex!]) {
                contact.lastName = row[lastNameIndex!]
            }

            contacts.push(contact)
        }

        // process the batch
        const result = await upsertManyContactsUseCase(
            ctx,
            contacts,
            organisation
        )
        createdCount += result.created
        updatedCount += result.updated
    }

    return {
        createdCount,
        updatedCount,
    }
}

function getHeaderIndex(headers: string[], header: string) {
    header = header.toLowerCase().trim()
    headers = headers.map((header) => header.toLowerCase().trim())

    const index = headers.indexOf(header)
    if (index < 0) {
        return null
    }
    return index
}

function getHeaderIndexOrThrow(headers: string[], header: string) {
    const index = getHeaderIndex(headers, header)
    if (index === null) {
        throw new Error(`Header ${header} not found.`)
    }
    return index
}

function isValidHeaderIndex(index: number | null) {
    return typeof index === 'number' && index >= 0
}
