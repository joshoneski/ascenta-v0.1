import { db } from '@/db'
import { members, organisations, users } from '@/db/schema'
import { userAdapters } from '@/server/auth/user.adapter'
import {
    organisationAdapters,
    organisationMemberAdapters,
} from '@/server/organisations/organisation.adapter'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import {
    CreateOrganisationParams,
    UpdateOrganisationParams,
} from '@/server/organisations/organisation.types'
import { eq } from 'drizzle-orm'

export const organisationsRepo = {
    query: {
        findById: async (organisationId: OrganisationId) => {
            const [organisation] = await db
                .select()
                .from(organisations)
                .where(eq(organisations.id, organisationId.value))

            if (!organisation) {
                throw new Error('Organisation not found.')
            }

            return organisationAdapters.dbToEntity(organisation)
        },
        findBySlug: async (slug: string) => {
            const [organisation] = await db
                .select()
                .from(organisations)
                .where(eq(organisations.slug, slug))

            if (!organisation) {
                throw new Error('Organisation not found.')
            }

            return organisationAdapters.dbToEntity(organisation)
        },
        findByType: async (type: 'admin' | 'charity') => {
            const results = await db
                .select()
                .from(organisations)
                .where(eq(organisations.type, type))

            return results.map(organisationAdapters.dbToEntity)
        },
        findOrganisationMembers: async (organisationId: OrganisationId) => {
            const results = await db
                .select()
                .from(members)
                .where(eq(members.organisationId, organisationId.value))
                .innerJoin(users, eq(members.userId, users.id))

            return results.map((result) => {
                return {
                    organisationMember: organisationMemberAdapters.dbToEntity(
                        result.members
                    ),
                    user: userAdapters.dbToEntity(result.users),
                }
            })
        },
        findOrganisationsWithUser: async (userId: string) => {
            const results = await db
                .select()
                .from(members)
                .where(eq(members.userId, userId))
                .innerJoin(
                    organisations,
                    eq(organisations.id, members.organisationId)
                )

            return results.map((result) => {
                return organisationAdapters.dbToEntity(result.organisations)
            })
        },
    },
    mutate: {
        create: async (params: CreateOrganisationParams) => {
            const [organisation] = await db
                .insert(organisations)
                .values([params])
                .returning()

            if (!organisation) {
                throw new Error('Failed to create organisation.')
            }

            return organisationAdapters.dbToEntity(organisation)
        },

        update: async (
            organisationId: OrganisationId,
            update: UpdateOrganisationParams
        ) => {
            await db
                .update(organisations)
                .set(update)
                .where(eq(organisations.id, organisationId.value))
        },
    },
}
