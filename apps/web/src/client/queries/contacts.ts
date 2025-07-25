import { api } from '@/client/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useContactEnrichmentDetails = (params: {
    contact: string
    organisation: string
}) => {
    return useQuery({
        queryKey: [
            'contacts',
            `contact|${params.contact}`,
            `organisation|${params.organisation}`,
        ],
        queryFn: async () => {
            const response = await api.contacts.getEnrichmentDetails(params)
            if (!response.success) {
                if (response.status === 404) {
                    return null
                }
                throw response.error
            }
            return response.data
        },
    })
}

export const useEnrichContact = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            contact: string
            organisation: string
        }) => {
            const response = await api.contacts.enrich(params)
            if (!response.success) {
                throw response.error
            }
            return response.data
        },

        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                [
                    'contacts',
                    `contact|${variables.contact}`,
                    `organisation|${variables.organisation}`,
                ],
                data
            ),
    })
}
