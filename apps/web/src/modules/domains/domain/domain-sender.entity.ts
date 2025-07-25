export type DomainSenderEntityProps = {
    id: string
    domainId: string
    organisationId: string
    name: string
    username: string
    createdAt: Date
}

export class DomainSenderEntity {
    public readonly props: DomainSenderEntityProps

    constructor(input: DomainSenderEntityProps) {
        this.props = { ...input }
    }
}
