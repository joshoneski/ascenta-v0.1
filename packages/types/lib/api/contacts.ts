import { ContactEnrichmentDetailsDTO } from '@ascenta-plus/web/src/shared/dtos/contact.dto'

export type ContactBulkEnrichRequest = {}
export type ContactBulkEnrichResponse = {
    success: true
}

export type ContactCreateRequestBody = {
    email: string
    firstName?: string | null | undefined
    lastName?: string | null | undefined
}

export type ContactCreateResponse = {
    id: string
}

export type ContactImportRequestBody = {
    file: File
}

export type ContactImportResponse = {
    created: number
    updated: number
}

export type ContactEnrichResponse = ContactEnrichmentDetailsDTO
