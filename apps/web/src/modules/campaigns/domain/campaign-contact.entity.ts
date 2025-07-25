type CampaignContactEntityProps = {
    id: string
    campaignId: string
    contactId: string
    organisationId: string
    createdAt: Date
}

export class CampaignContactEntity {
    public readonly props: CampaignContactEntityProps

    constructor(input: CampaignContactEntityProps) {
        this.props = { ...input }
    }
}
