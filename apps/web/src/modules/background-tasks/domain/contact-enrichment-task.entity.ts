type ContactEnrichmentTaskEntityProps = {
    id: string
    contactId: string
    jobId: string
    organisationId: string
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'skipped'
    error: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export class ContactEnrichmentTaskEntity {
    public readonly props: ContactEnrichmentTaskEntityProps

    constructor(input: ContactEnrichmentTaskEntityProps) {
        this.props = { ...input }
    }

    markAsCompleted() {
        const now = new Date()
        this.props.status = 'completed'
        this.props.completedAt = now
        this.props.updatedAt = now
    }

    markAsFailed(error: string) {
        const now = new Date()
        this.props.status = 'failed'
        this.props.error = error
        this.props.completedAt = now
        this.props.updatedAt = now
    }

    markAsProcessing() {
        const now = new Date()
        this.props.status = 'processing'
        this.props.startedAt = now
        this.props.updatedAt = now
    }
}
