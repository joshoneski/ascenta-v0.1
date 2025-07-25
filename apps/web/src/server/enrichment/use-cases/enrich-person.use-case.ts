import { db } from '@/db'
import { persons } from '@/db/schema'
import { buildConflictUpdateExcludeColumns } from '@/server/_utils/database'
import { backendConfig } from '@/server/backend-config'
import { personAdapters } from '@/server/enrichment/person.adapter'
import { createPersonPersonaUseCase } from '@/server/enrichment/use-cases/create-person-persona.use-case'
import { updatePersonScoreIfNeededUseCase } from '@/server/enrichment/use-cases/update-person-score-if-needed.use-case'
import { OrganisationEntity } from '@/server/organisations/organisation.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { betterFetch } from '@better-fetch/fetch'
import { z } from 'zod'

export async function enrichPersonUseCase(
    email: string,
    organisation: OrganisationEntity,
    user: UserDTO
) {
    const { data, error } = await betterFetch(
        `https://api.apollo.io/api/v1/people/match?email=${email}`,
        {
            headers: { 'X-API-Key': backendConfig.APOLLO_API_KEY },
            method: 'POST',
            output: apolloPersonSchema,
        }
    )

    if (error) {
        throw new Error('')
    }

    const [result] = await db
        .insert(persons)
        .values(createInsertValue(email, data))
        .onConflictDoUpdate({
            target: persons.email,
            set: buildConflictUpdateExcludeColumns(persons, [
                'id',
                'email',
                'createdAt',
            ]),
        })
        .returning()

    if (!result) {
        throw new Error('Failed to enrich contact.')
    }

    const person = personAdapters.dbToEntity(result)
    const personPersona = await createPersonPersonaUseCase(person)

    await updatePersonScoreIfNeededUseCase(person, personPersona)

    return { person, personPersona }
}

function createInsertValue(
    email: string,
    data: z.infer<typeof apolloPersonSchema>
) {
    // Note: we take data from contact before person as this gives us control over updating data in Apollo
    const apolloContact = data.person?.contact
    const apolloPerson = data.person
    const apolloOrganisation = data.person?.organization

    const person: typeof persons.$inferInsert = {
        email,
        updatedAt: new Date(),
    }

    const firstName = apolloPerson?.first_name || apolloContact?.first_name
    if (firstName) {
        person.firstName = firstName
    }

    const lastName = apolloPerson?.last_name || apolloContact?.last_name
    if (lastName) {
        person.lastName = lastName
    }

    const city = apolloPerson?.city || apolloContact?.city
    if (city) {
        person.city = city
    }

    const country = apolloPerson?.country || apolloContact?.country
    if (country) {
        person.country = country
    }

    const region = apolloPerson?.state || apolloContact?.state
    if (region) {
        person.region = region
    }

    const company = apolloOrganisation?.name || apolloContact?.organization_name
    if (company) {
        person.company = company
    }

    const profession = apolloPerson?.title || apolloContact?.title
    if (profession) {
        person.profession = profession
    }

    const timezone = apolloContact?.time_zone //  || apolloOrganisation?.time_zone
    if (timezone) {
        person.timezone = timezone
    }

    return person
}

const apolloPersonSchema = z.object({
    person: z
        .object({
            first_name: z.string().nullish(),
            last_name: z.string().nullish(),
            title: z.string().nullish(),
            state: z.string().nullish(),
            city: z.string().nullish(),
            country: z.string().nullish(),
            contact: z
                .object({
                    first_name: z.string().nullish(),
                    last_name: z.string().nullish(),
                    title: z.string().nullish(),
                    organization_name: z.string().nullish(),
                    state: z.string().nullish(),
                    city: z.string().nullish(),
                    country: z.string().nullish(),
                    time_zone: z.string().nullish(),
                })
                .nullish(),
            organization: z
                .object({
                    name: z.string().nullish(),
                    state: z.string().nullish(),
                    city: z.string().nullish(),
                    country: z.string().nullish(),
                    time_zone: z.string().nullish(),
                })
                .nullish(),
        })
        .nullish(),
})
