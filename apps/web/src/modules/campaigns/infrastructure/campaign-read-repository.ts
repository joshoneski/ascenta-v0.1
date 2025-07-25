import { db } from '@/db'
import { campaigns, domainSenders, segments } from '@/db/schema'
import { campaignsAdapters } from '@/modules/campaigns/campaigns.adapter'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { and, desc, eq } from 'drizzle-orm'

export const campaignReadRepository = {
    getCampaignCount: async (criteria: {
        filter: {
            organisationId: OrganisationId
        }
    }) => {
        return -1
    },

    getDetails: async (criteria: {
        filter: {
            campaignId: string
            organisationId: string
        }
    }) => {
        const [details] = await db
            .select({
                ctaUrl: campaigns.ctaUrl,
                title: campaigns.title,
                strategy: campaigns.strategy,
                summary: campaigns.summary,
                segmentId: campaigns.segmentId,
                segmentName: segments.name,
                domainSenderId: campaigns.domainSenderId,
                domainSenderName: domainSenders.name,
            })
            .from(campaigns)
            .leftJoin(segments, eq(campaigns.segmentId, segments.id))
            .leftJoin(
                domainSenders,
                eq(campaigns.domainSenderId, domainSenders.id)
            )
            .where(
                and(
                    eq(campaigns.id, criteria.filter.campaignId),
                    eq(campaigns.organisationId, criteria.filter.organisationId)
                )
            )

        return details ?? null
    },

    getCampaignList: async (criteria: {
        filter: {
            organisationId: OrganisationId
        }
        skip: number
        limit: number
    }) => {
        const results = await db
            .select()
            .from(campaigns)
            .where(
                eq(
                    campaigns.organisationId,
                    criteria.filter.organisationId.value
                )
            )
            .orderBy(desc(campaigns.createdAt))

        return results.map(campaignsAdapters.dbToEntity)
    },

    getCampaignMetadata: async (criteria: {
        filter: {
            campaignId: string
            organisationId: string
        }
    }) => {
        const [metadata] = await db
            .select({
                status: campaigns.status,
                draftStep: campaigns.draftStep,
            })
            .from(campaigns)
            .where(
                and(
                    eq(campaigns.id, criteria.filter.campaignId),
                    eq(campaigns.organisationId, criteria.filter.organisationId)
                )
            )

        return metadata ?? null
    },

    getContactCount: async (criteria: {
        filter: {
            campaignId: string
            organisationId: OrganisationId
        }
    }) => {
        return -1
    },
}
