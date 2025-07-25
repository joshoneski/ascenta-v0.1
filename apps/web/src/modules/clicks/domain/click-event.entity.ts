export type ClickEventEntityProps = {
    id: string
    clickId: string
    organisationId: string
    metadata: Record<string, unknown>
    createdAt: Date
}

export class ClickEventEntity {
    public readonly props: ClickEventEntityProps

    constructor(input: ClickEventEntityProps) {
        this.props = { ...input }
    }
}
