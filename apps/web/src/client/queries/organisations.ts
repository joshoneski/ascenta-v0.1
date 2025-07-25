import { api } from '@/client/lib/api'
import { OrganisationUpdateRequestBody } from '@ascenta-plus/types/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useOrganisationDetails = (params: { organisation: string }) => {
    return useQuery({
        queryKey: ['organisations', `organisation|${params.organisation}`],
        queryFn: async () => {
            const response = await api.organisations.retrieve(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
    })
}

export const useOrganisationMembers = (params: { organisation: string }) => {
    return useQuery({
        queryKey: ['organisations', `organisation|${params.organisation}`],
        queryFn: async () => {
            const response = await api.members.getMembers(params)
            if (!response.success) {
                throw response.error
            }
            return response.data.members
        },
    })
}

export const useUpdateOrganisationDetails = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            organisation: string
            update: OrganisationUpdateRequestBody
        }) => {
            const response = await api.organisations.update(
                params.organisation,
                params.update
            )
            if (!response.success) {
                throw response.error
            }
            return response.data
        },
        onSuccess: (_, variables) =>
            queryClient.invalidateQueries({
                queryKey: [
                    'organisations',
                    `organisation|${variables.organisation}`,
                ],
            }),
    })
}
