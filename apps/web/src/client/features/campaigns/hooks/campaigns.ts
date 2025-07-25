import { api } from '@/client/lib/api'
import {
    CampaignCompleteContentApiRequestBody,
    CampaignCompleteStrategyApiRequestBody,
    CampaignCreateApiRequestBody,
    CampaignEmailImproveApiRequestBody,
    CampaignUpdateApiRequestBody,
} from '@ascenta-plus/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateCampaign = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            body: CampaignCreateApiRequestBody
            organisation: string
        }) => {
            const response = await api.campaigns.create(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                ['campaigns', `organisation|${variables.organisation}`],
                data
            ),
    })
}

export const useUpdateCampaign = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            body: CampaignUpdateApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const response = await api.campaigns.update(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                [
                    'campaigns',
                    `campaigns|${variables.campaign}`,
                    `organisation|${variables.organisation}`,
                ],
                data
            ),
    })
}

export const useCompleteCampaignStrategy = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            body: CampaignCompleteStrategyApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const response = await api.campaigns.completeStrategy(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                [
                    'campaigns',
                    `campaigns|${variables.campaign}`,
                    `organisation|${variables.organisation}`,
                ],
                data
            ),
    })
}

export const useCompleteCampaignContent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            body: CampaignCompleteContentApiRequestBody
            campaign: string
            organisation: string
        }) => {
            const response = await api.campaigns.completeContent(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                [
                    'campaigns',
                    `campaigns|${variables.campaign}`,
                    `organisation|${variables.organisation}`,
                ],
                data
            ),
    })
}

export const useCampaignEmailImprove = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            body: CampaignEmailImproveApiRequestBody
            campaign: string
            email: string
            organisation: string
        }) => {
            const response = await api.campaignEmails.improve(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                [
                    'campaignEmails',
                    `campaignEmails|${variables.email}`,
                    `organisation|${variables.organisation}`,
                ],
                data
            ),
    })
}
