type ContactEnrichmentJobEntityProps = {
    id: string
    organisationId: string
    status: 'running' | 'completed' | 'cancelled'
    totalCount: number
    completedCount: number
    failedCount: number
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export class ContactEnrichmentJobEntity {
    public readonly props: ContactEnrichmentJobEntityProps

    constructor(input: ContactEnrichmentJobEntityProps) {
        this.props = { ...input }
    }

    incrementCompletedTasks() {
        this.props.completedCount++
        this.props.updatedAt = new Date()
    }

    incrementFailedTasks() {
        this.props.failedCount++
        this.props.updatedAt = new Date()
    }

    markAsCompleteIfNeeded() {
        const isComplete =
            this.props.completedCount + this.props.failedCount >=
            this.props.totalCount

        if (isComplete) {
            const now = new Date()
            this.props.status = 'completed'
            this.props.completedAt = now
            this.props.updatedAt = now
        }
    }
}
