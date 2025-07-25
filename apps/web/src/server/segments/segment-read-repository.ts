import { db } from '@/db'
import {
    emailVerifications,
    enrichedContactsView,
    segmentFilters,
    segments,
} from '@/db/schema'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { buildSegmentDbFilters } from '@/server/segments/common/filters'
import { ContactListItemDTO } from '@/shared/dtos/contact.dto'
import { SegmentDetailsDTO } from '@/shared/dtos/segment.dto'
import { and, count, desc, eq } from 'drizzle-orm'

export const segmentReadRepository = {
    getSegmentContactCount: async (criteria: {
        filter: {
            segmentId: string
            organisationId: OrganisationId
        }
    }): Promise<number> => {
        const filters = await segmentReadRepository.getSegmentFilters(
            criteria.filter.segmentId
        )

        const dbFilters = buildSegmentDbFilters(filters)

        const [result] = await db
            .select({ count: count() })
            .from(enrichedContactsView)
            .where(
                and(
                    eq(
                        enrichedContactsView.organisationId,
                        criteria.filter.organisationId.value
                    ),
                    ...dbFilters
                )
            )

        return result?.count ?? 0
    },

    getSegmentContactList: async (criteria: {
        filter: {
            segmentId: string
            organisationId: OrganisationId
        }
        skip: number
        limit: number
    }): Promise<ContactListItemDTO[]> => {
        const filters = await segmentReadRepository.getSegmentFilters(
            criteria.filter.segmentId
        )

        const dbFilters = buildSegmentDbFilters(filters)

        return db
            .select({
                id: enrichedContactsView.id,
                email: enrichedContactsView.email,
                emailStatus: emailVerifications.status,
                firstName: enrichedContactsView.firstName,
                lastName: enrichedContactsView.lastName,
            })
            .from(enrichedContactsView)
            .leftJoin(
                emailVerifications,
                eq(
                    emailVerifications.id,
                    enrichedContactsView.emailVerificationId
                )
            )
            .where(
                and(
                    eq(
                        enrichedContactsView.organisationId,
                        criteria.filter.organisationId.value
                    ),
                    ...dbFilters
                )
            )
            .orderBy(desc(enrichedContactsView.createdAt))
            .offset(criteria.skip)
            .limit(criteria.limit)
    },

    getSegmentCount: async (
        organisationId: OrganisationId
    ): Promise<number> => {
        const [result] = await db
            .select({ count: count() })
            .from(segments)
            .where(eq(segments.organisationId, organisationId.value))

        return result?.count ?? 0
    },

    getSegmentDetails: async (
        segmentId: string
    ): Promise<SegmentDetailsDTO | null> => {
        const results = await db
            .select({
                id: segments.id,
                organisation: segments.organisationId,
                createdAt: segments.createdAt,
                name: segments.name,
                filters: {
                    id: segmentFilters.id,
                    field: segmentFilters.field,
                    operator: segmentFilters.operator,
                    value: segmentFilters.value,
                },
            })
            .from(segments)
            .leftJoin(segmentFilters, eq(segmentFilters.segmentId, segments.id))
            .where(eq(segments.id, segmentId))

        const segment = results[0]
        if (!segment) {
            return null
        }

        return {
            ...segment,
            createdAt: segment.createdAt.getTime(),
            filters: results
                .map((result) => result.filters)
                .filter((result) => result)
                .map((result) => result!),
        }
    },

    getSegmentFilters: async (segmentId: string) => {
        return db
            .select()
            .from(segmentFilters)
            .where(eq(segmentFilters.segmentId, segmentId))
    },

    getSegmentList: async (criteria: {
        filter: {
            organisationId: OrganisationId
        }
        skip: number
        limit: number
    }) => {
        return db
            .select({
                id: segments.id,
                name: segments.name,
                createdAt: segments.createdAt,
            })
            .from(segments)
            .where(
                eq(
                    segments.organisationId,
                    criteria.filter.organisationId.value
                )
            )
            .orderBy(desc(segments.createdAt))
            .offset(criteria.skip)
            .limit(criteria.limit)
    },

    getSegmentOptions: async (criteria: {
        filter: {
            organisationId: OrganisationId
        }
    }) => {
        return db
            .select({
                id: segments.id,
                name: segments.name,
            })
            .from(segments)
            .where(
                eq(
                    segments.organisationId,
                    criteria.filter.organisationId.value
                )
            )
            .orderBy(desc(segments.createdAt))
    },
}
