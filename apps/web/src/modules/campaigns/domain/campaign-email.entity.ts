import { CampaignEmailStatus } from '@/modules/campaigns'

type CampaignEmailEntityProps = {
    id: string
    campaignId: string
    organisationId: string
    contentFocus: string
    purpose: string
    sample: string
    startOffsetMs: number
    status: CampaignEmailStatus
    subject: string
    createdAt: Date
    sentAt: Date | null
}

export class CampaignEmailEntity {
    public readonly props: CampaignEmailEntityProps

    constructor(input: CampaignEmailEntityProps) {
        this.props = { ...input }
    }

    markAsFailed() {
        this.props.status = 'failed'
    }

    markAsScheduled() {
        this.props.status = 'scheduled'
    }

    markAsSent() {
        this.props.status = 'sent'
    }
}
