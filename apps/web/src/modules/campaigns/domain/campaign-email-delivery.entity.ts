import { CampaignEmailDeliveryStatus } from '@/modules/campaigns'

type CampaignEmailDeliveryEntityProps = {
    id: string
    campaignId: string
    campaignContactId: string
    campaignEmailId: string
    organisationId: string
    error: string | null
    status: CampaignEmailDeliveryStatus
    statusUpdatedAt: Date
    senderEmail: string | null
    senderName: string | null
    recipientEmail: string | null
    subject: string | null
    html: string | null
    createdAt: Date
}

export class CampaignEmailDeliveryEntity {
    public readonly props: CampaignEmailDeliveryEntityProps

    constructor(input: CampaignEmailDeliveryEntityProps) {
        this.props = { ...input }
    }

    markAsFailed(error: string) {
        this.props.error = error
        this.props.status = 'failed'
        this.props.statusUpdatedAt = new Date()
    }

    markAsProcessing() {
        this.props.status = 'processing'
        this.props.statusUpdatedAt = new Date()
    }

    markAsScheduled() {
        this.props.status = 'scheduled'
        this.props.statusUpdatedAt = new Date()
    }

    markAsSent() {
        this.props.status = 'sent'
        this.props.statusUpdatedAt = new Date()
    }

    setEmailDetails(params: {
        sender: {
            email: string
            name: string
        }
        recipient: {
            email: string
        }
        subject: string
        html: string
    }) {
        this.props.senderEmail = params.sender.email
        this.props.senderName = params.sender.name
        this.props.recipientEmail = params.recipient.email
        this.props.subject = params.subject
        this.props.html = params.html
    }
}
