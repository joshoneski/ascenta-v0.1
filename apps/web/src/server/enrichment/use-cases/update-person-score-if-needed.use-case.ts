import { db } from '@/db'
import { persons } from '@/db/schema'
import { PersonPersonaEntity } from '@/server/enrichment/person-persona.entity'
import { PersonEntity } from '@/server/enrichment/person.entity'
import { eq } from 'drizzle-orm'

export async function updatePersonScoreIfNeededUseCase(
    person: PersonEntity,
    personPersona: PersonPersonaEntity | null
) {
    person.calculateEnrichmentScore(personPersona)

    await db
        .update(persons)
        .set({ enrichmentScore: person.props.enrichmentScore.value })
        .where(eq(persons.id, person.props.id.value))
}
