import { personPersonas, persons } from '@/db/schema'
import {
    PersonPersonaEntity,
    PersonPersonaId,
} from '@/server/enrichment/person-persona.entity'
import {
    PersonEnrichmentScore,
    PersonEntity,
    PersonId,
} from '@/server/enrichment/person.entity'

export const personAdapters = {
    dbToEntity: (person: typeof persons.$inferSelect): PersonEntity =>
        new PersonEntity({
            id: new PersonId(person.id),
            email: person.email,
            firstName: person.firstName,
            lastName: person.lastName,

            city: person.city,
            country: person.country,
            region: person.region,

            company: person.company,
            profession: person.profession,

            enrichmentScore: new PersonEnrichmentScore(person.enrichmentScore),
            createdAt: person.createdAt,
        }),
}

export const personPersonaAdapters = {
    dbToEntity: (
        personPersona: typeof personPersonas.$inferSelect
    ): PersonPersonaEntity =>
        new PersonPersonaEntity({
            id: new PersonPersonaId(personPersona.id),
            person: new PersonId(personPersona.personId),
            summary: personPersona.summary,
            motivations: personPersona.motivations,
            communicationStyle: personPersona.communicationStyle,
            potentialObjections: personPersona.potentialObjections,
            engagementSuggestions: personPersona.engagementSuggestions,
            createdAt: personPersona.createdAt,
        }),
}
