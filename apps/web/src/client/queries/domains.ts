import { api } from '@/client/lib/api'
import {
    DomainCreateApiRequestBody,
    DomainListApiResponse,
    DomainSenderCreateApiRequestBody,
} from '@ascenta-plus/types'
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'

function createQueryKeys(organisation: string) {
    return ['domains', 'organisations', `organisation|${organisation}`]
}

export const useDomains = (
    params: { organisation: string },
    options?: Omit<
        UseQueryOptions<DomainListApiResponse, Error, DomainListApiResponse>,
        'queryKey' | 'queryFn'
    >
) => {
    return useQuery({
        queryKey: createQueryKeys(params.organisation),
        queryFn: async () => {
            const response = await api.domains.list(params.organisation)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        ...options,
    })
}

export const useVerifyDomain = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            domain: string
            organisation: string
        }) => {
            return api.domains.verify(params.organisation, params.domain)
        },
        onSuccess: (_, variables) =>
            queryClient.invalidateQueries({
                queryKey: createQueryKeys(variables.organisation),
            }),
    })
}

export const useCreateDomain = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            organisation: string
            body: DomainCreateApiRequestBody
        }) => {
            const response = await api.domains.create(
                params.organisation,
                params.body
            )
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (_, variables) =>
            queryClient.invalidateQueries({
                queryKey: createQueryKeys(variables.organisation),
            }),
    })
}

export const useCreateDomainSender = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            domain: string
            organisation: string
            body: DomainSenderCreateApiRequestBody
        }) =>
            api.domains.senders.create(
                params.domain,
                params.organisation,
                params.body
            ),
        onSuccess: (_, variables) =>
            queryClient.invalidateQueries({
                queryKey: createQueryKeys(variables.organisation),
            }),
    })
}
