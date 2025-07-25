import { UserDTO } from '@/shared/dtos/user.dto'

export type ContactEnrichmentJobStatus = 'cancelled' | 'completed' | 'running'

export type ContactEnrichmentTaskStatus =
    | 'completed'
    | 'failed'
    | 'processing'
    | 'queued'
    | 'skipped'

export type ActiveContactEnrichmentJobRequest = {
    organisationId: string
    user: UserDTO
}

export type ActiveContactEnrichmentJobResult = {
    id: string
    completed: number
    failed: number
    total: number
} | null

export type RecentContactEnrichmentTasksRequest = {
    organisationId: string
    user: UserDTO
}

export type RecentContactEnrichmentTasksResult = {
    tasks: ContactEnrichmentListItemDTO[]
}

export type ContactEnrichmentListItemDTO = {
    status: ContactEnrichmentTaskStatus
    contact: {
        email: string
        firstName: string | null
        lastName: string | null
    }
}
