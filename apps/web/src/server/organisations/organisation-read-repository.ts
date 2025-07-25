import { db } from '@/db'
import { members, users } from '@/db/schema'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { OrganisationMemberListItemDTO } from '@/shared/dtos/organisation.dto'
import { eq } from 'drizzle-orm'

export const organisationsReadRepo = {
    getOrganisationMembers: async (
        organisationId: OrganisationId
    ): Promise<OrganisationMemberListItemDTO[]> => {
        const results = await db
            .select({
                id: members.id,
                createdAt: members.createdAt,
                name: users.name,
                email: users.email,
            })
            .from(members)
            .where(eq(members.organisationId, organisationId.value))
            .innerJoin(users, eq(members.userId, users.id))

        return results.map((result) => {
            return {
                ...result,
                createdAt: result.createdAt.getTime(),
            }
        })
    },
}
