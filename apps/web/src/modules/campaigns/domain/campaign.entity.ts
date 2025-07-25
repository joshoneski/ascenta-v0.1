import { CampaignDraftStep, CampaignStatus } from '@/modules/campaigns'

export type CampaignEntityProps = {
    id: string
    organisationId: string
    segmentId: string | null
    domainSenderId: string | null
    createdAt: Date
    title: string
    status: CampaignStatus
    draftStep: CampaignDraftStep | null
    summary: string
    strategy: string
    ctaUrl: string
    startedAt: Date | null
    endedAt: Date | null
    pausedAt: Date | null
    totalPausedMs: number
}

export class CampaignEntity {
    public readonly props: CampaignEntityProps

    constructor(input: CampaignEntityProps) {
        this.props = { ...input }
    }

    pause() {
        if (this.props.status !== 'running') {
            throw new Error('')
        }
        this.props.status = 'paused'
        this.props.pausedAt = new Date()
    }

    resume() {
        if (this.props.status !== 'paused') {
            throw new Error('')
        }
        const pauseDuration =
            new Date().getTime() - this.props.pausedAt!.getTime()

        this.props.status = 'running'
        this.props.pausedAt = null
        this.props.totalPausedMs += pauseDuration
    }

    launch() {
        if (
            this.props.status !== 'draft' ||
            this.props.draftStep !== 'review'
        ) {
            throw new Error('Campaign must be in draft review step to launch')
        }
        this.props.status = 'running'
        this.props.draftStep = null
        this.props.startedAt = new Date()
    }

    achieve() {
        this.pause()
    }
}
