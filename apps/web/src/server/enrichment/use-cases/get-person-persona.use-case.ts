import { db } from '@/db'
import { personPersonas } from '@/db/schema'
import { personPersonaAdapters } from '@/server/enrichment/person.adapter'
import { PersonId } from '@/server/enrichment/person.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { desc, eq } from 'drizzle-orm'

export async function getPersonPersonaUseCase(
    personId: PersonId,
    user: UserDTO
) {
    const [result] = await db
        .select()
        .from(personPersonas)
        .where(eq(personPersonas.personId, personId.value))
        .orderBy(desc(personPersonas.createdAt))
        .limit(1)

    if (!result) {
        return null
    }

    return personPersonaAdapters.dbToEntity(result)
}
