import { DomainListItemDTO } from '@ascenta-plus/web/src/modules/domains/domains.types'
import { PaginationMeta } from '@ascenta-plus/web/src/shared/dtos/pagination.dto'

export type DomainCreateApiRequestBody = {
    domain: string
}

export type DomainCreateApiResponse = {
    id: string
}

export type DomainListApiRequestBody = {}

export type DomainListApiResponse = {
    domains: DomainListItemDTO[]
    meta: PaginationMeta
}

export type DomainVerifyApiResponse = {
    success: boolean
}

export type DomainSenderCreateApiRequestBody = {
    senderName: string
    senderUsername: string
}

export type DomainSenderCreateApiResponse = {
    id: string
}
