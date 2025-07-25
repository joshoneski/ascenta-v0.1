import { ClickTypeValue } from '@/modules/clicks/click.emums'

export type ClickEntityProps = {
    id: string
    organisationId: string
    token: string
    type: ClickTypeValue
    metadata: Record<string, unknown> // optional structured data, e.g. emailId, contactId
    destinationUrl: string
    createdAt: Date
}

export class ClickEntity {
    public readonly props: ClickEntityProps

    constructor(input: ClickEntityProps) {
        this.props = { ...input }
    }
}
