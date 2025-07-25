import { PaginationMeta } from '@/shared/dtos/pagination.dto'
import { UserDTO } from '@/shared/dtos/user.dto'

export type DomainCreateRequest = {
    input: { domain: string }
    organisationId: string
    user: UserDTO
}

export type DomainCreateResult = {
    id: string
}

export type DomainListRequest = {
    organisationId: string
    user: UserDTO
}

export type DomainListResult = {
    domains: DomainListItemDTO[]
    meta: PaginationMeta
}

export type DomainVerifyRequest = {
    domainId: string
    organisationId: string
    user: UserDTO
}

export type DomainVerifyResult = void

export type DomainListItemDTO = {
    id: string
    domain: string
    status: string // TODO: custom type?
    senders: DomainSenderListItemDTO[]
    records: {
        name: string
        record: string
        ttl: string
        type: string
        status: string
        value: string
    }[]
}

export type DomainSenderCreateRequest = {
    domainId: string
    senderName: string
    senderUsername: string
}

export type DomainSenderCreateResult = {
    id: string
}

export type DomainSenderListItemDTO = {
    email: string
    name: string
}
