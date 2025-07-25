import { api } from '@/client/lib/api'
import { SegmentCreateRequestBody } from '@ascenta-plus/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function createQueryKeys(organisation: string) {
    return ['domains', 'organisations', `organisation|${organisation}`]
}

export const useCreateSegment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (params: {
            organisation: string
            body: SegmentCreateRequestBody
        }) => {
            const response = await api.segments.create(
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
