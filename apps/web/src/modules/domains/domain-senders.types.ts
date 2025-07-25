export type DomainSenderDTO = {
    id: string
    email: string
    name: string
}

export type GetDomainSendersRequest = {
    domainId?: string
    organisationId: string
}

export type GetDomainSendersResponse = {
    senders: DomainSenderDTO[]
}
