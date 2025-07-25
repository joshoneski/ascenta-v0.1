import { db } from '@/db'
import { persons } from '@/db/schema'
import { personAdapters } from '@/server/enrichment/person.adapter'
import { PersonId } from '@/server/enrichment/person.entity'
import { UserDTO } from '@/shared/dtos/user.dto'
import { eq } from 'drizzle-orm'

export async function getPersonUseCase(personId: PersonId, user: UserDTO) {
    const [person] = await db
        .select()
        .from(persons)
        .where(eq(persons.id, personId.value))

    if (!person) {
        throw new Error('Person does not exist')
    }

    return personAdapters.dbToEntity(person)
}
