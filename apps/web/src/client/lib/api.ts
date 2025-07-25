import { X_ORGANISATION_HEADER } from '@/shared/constants'
import { ApiSuccessResponse } from '@/shared/types'
import {
    CampaignCompleteContentApiRequestBody,
    CampaignCompleteContentApiResponse,
    CampaignCompleteStrategyApiRequestBody,
    CampaignCompleteStrategyApiResponse,
    CampaignCreateApiRequestBody,
    CampaignCreateApiResponse,
    CampaignEmailImproveApiRequestBody,
    CampaignEmailImproveApiResponse,
    CampaignLaunchApiRequestBody,
    CampaignLaunchApiResponse,
    CampaignPriceEstimateApiResponse,
    CampaignUpdateApiRequestBody,
    CampaignUpdateApiResponse,
    ContactBulkEnrichResponse,
    ContactCreateRequestBody,
    ContactCreateResponse,
    ContactEnrichResponse,
    ContactImportRequestBody,
    ContactImportResponse,
    DomainCreateApiRequestBody,
    DomainCreateApiResponse,
    DomainListApiResponse,
    DomainSenderCreateApiRequestBody,
    DomainSenderCreateApiResponse,
    DomainVerifyApiResponse,
    OrganisationCreateRequestBody,
    OrganisationCreateResponse,
    OrganisationMembersResponse,
    OrganisationRetrieveResponse,
    OrganisationUpdateRequestBody,
    OrganisationUpdateResponse,
    SegmentCreateRequestBody,
    SegmentCreateResponse,
} from '@ascenta-plus/types'

export class ApiError {
    constructor(
        public message: string,
        public code?: string
    ) {}
}

async function apiJsonEndpoint<ResponseObject extends object>(params: {
    path: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: XMLHttpRequestBodyInit
    header?: Record<string, string>
}): Promise<
    | { success: true; data: ApiSuccessResponse<ResponseObject> }
    | { success: false; status: number; error: ApiError }
> {
    const response = await fetch(params.path, {
        method: params.method,
        body: params.body,
        headers: params.header,
    })

    const body = await response.json()
    if (!response.ok) {
        return {
            error: new ApiError(body.error.message, body.error.code),
            status: response.status,
            success: false,
        }
    }

    return {
        success: true,
        data: body,
    }
}

export const api = {
    campaigns: {
        completeStrategy: (params: {
            body: CampaignCompleteStrategyApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const { body, campaign, organisation } = params
            return apiJsonEndpoint<CampaignCompleteStrategyApiResponse>({
                path: `/api/campaigns/${campaign}/complete-strategy`,
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        completeContent: (params: {
            body: CampaignCompleteContentApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const { body, campaign, organisation } = params
            return apiJsonEndpoint<CampaignCompleteContentApiResponse>({
                path: `/api/campaigns/${campaign}/complete-content`,
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        create: (params: {
            body: CampaignCreateApiRequestBody
            organisation: string
        }) => {
            const { body, organisation } = params
            return apiJsonEndpoint<CampaignCreateApiResponse>({
                path: '/api/campaigns',
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        update: (params: {
            body: CampaignUpdateApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const { body, campaign, organisation } = params
            return apiJsonEndpoint<CampaignUpdateApiResponse>({
                path: `/api/campaigns/${campaign}`,
                method: 'PATCH',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        launch: (params: {
            body: CampaignLaunchApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const { body, campaign, organisation } = params
            return apiJsonEndpoint<CampaignLaunchApiResponse>({
                path: `/api/campaigns/${campaign}/launch`,
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        estimatePrice: (params: { campaign: string; organisation: string }) => {
            const { campaign, organisation } = params
            return apiJsonEndpoint<CampaignPriceEstimateApiResponse>({
                path: `/api/campaigns/${campaign}/estimate-price`,
                method: 'GET',
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },
    },
    campaignEmails: {
        improve: (params: {
            body: CampaignEmailImproveApiRequestBody
            campaign: string
            email: string
            organisation: string
        }) => {
            const { body, campaign, email, organisation } = params
            return apiJsonEndpoint<CampaignEmailImproveApiResponse>({
                path: `/api/campaigns/${campaign}/emails/${email}/improve`,
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },
    },
    contacts: {
        bulkEnrich: (params: { organisation: string }) => {
            const { organisation } = params
            return apiJsonEndpoint<ContactBulkEnrichResponse>({
                path: `/api/contacts/bulk-enrich`,
                method: 'POST',
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        create: (
            params: ContactCreateRequestBody & { organisation: string }
        ) => {
            const { organisation, ...body } = params
            return apiJsonEndpoint<ContactCreateResponse>({
                path: '/api/contacts',
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        // TODO: rename to import or upload
        createMany: (
            params: ContactImportRequestBody & { organisation: string }
        ) => {
            const { organisation, file } = params

            const body = new FormData()
            body.append('file', file)

            return apiJsonEndpoint<ContactImportResponse>({
                path: '/api/contacts/upload',
                method: 'POST',
                body,
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        enrich: (params: { contact: string; organisation: string }) => {
            const { contact, organisation } = params
            return apiJsonEndpoint<ContactEnrichResponse>({
                path: `/api/contacts/${contact}/enrich`,
                method: 'POST',
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },

        exportUrl: (params: { organisation: string }) => {
            return `/api/contacts/export?organisation=${params.organisation}`
        },

        getEnrichmentDetails: (params: {
            contact: string
            organisation: string
        }) => {
            const { contact, organisation } = params
            return apiJsonEndpoint<ContactEnrichResponse>({
                path: `/api/contacts/${contact}/enrich`,
                method: 'GET',
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            })
        },
    },
    domains: {
        create: (organisation: string, body: DomainCreateApiRequestBody) =>
            apiJsonEndpoint<DomainCreateApiResponse>({
                path: '/api/domains',
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            }),

        list: (organisation: string) =>
            apiJsonEndpoint<DomainListApiResponse>({
                path: '/api/domains',
                method: 'GET',
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            }),

        verify: (organisation: string, domain: string) =>
            apiJsonEndpoint<DomainVerifyApiResponse>({
                path: `/api/domains/${domain}/verify`,
                method: 'POST',
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            }),

        senders: {
            create: (
                domain: string,
                organisation: string,
                body: DomainSenderCreateApiRequestBody
            ) =>
                apiJsonEndpoint<DomainSenderCreateApiResponse>({
                    path: `/api/domains/${domain}/senders`,
                    method: 'POST',
                    body: JSON.stringify(body),
                    header: {
                        [X_ORGANISATION_HEADER]: organisation,
                    },
                }),
        },
    },
    organisations: {
        create: (body: OrganisationCreateRequestBody) =>
            apiJsonEndpoint<OrganisationCreateResponse>({
                path: '/api/organisations',
                method: 'POST',
                body: JSON.stringify(body),
            }),

        retrieve: (params: { organisation: string }) =>
            apiJsonEndpoint<OrganisationRetrieveResponse>({
                path: '/api/organisations/me',
                method: 'GET',
                header: {
                    [X_ORGANISATION_HEADER]: params.organisation,
                },
            }),

        update: (organisation: string, body: OrganisationUpdateRequestBody) =>
            apiJsonEndpoint<OrganisationUpdateResponse>({
                path: '/api/organisations/me',
                method: 'PATCH',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            }),
    },
    members: {
        getMembers: (params: { organisation: string }) =>
            apiJsonEndpoint<OrganisationMembersResponse>({
                path: `/api/members`,
                method: 'GET',
                header: {
                    [X_ORGANISATION_HEADER]: params.organisation,
                },
            }),
    },
    segments: {
        create: (organisation: string, body: SegmentCreateRequestBody) =>
            apiJsonEndpoint<SegmentCreateResponse>({
                path: '/api/segments',
                method: 'POST',
                body: JSON.stringify(body),
                header: {
                    [X_ORGANISATION_HEADER]: organisation,
                },
            }),
    },
}
