import { db } from '@/db'
import { persons } from '@/db/schema'
import { personAdapters } from '@/server/enrichment/person.adapter'
import { UserDTO } from '@/shared/dtos/user.dto'
import { eq } from 'drizzle-orm'

export async function getPersonByEmailUseCase(email: string, user: UserDTO) {
    const [person] = await db
        .select()
        .from(persons)
        .where(eq(persons.email, email))

    if (!person) {
        return null
    }

    return personAdapters.dbToEntity(person)
}
