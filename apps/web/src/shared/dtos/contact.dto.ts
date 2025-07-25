import { EmailVerificationStatus } from '@/server/email-verification/email-verification.types'

// TODO: replace with ContactDetailsDTO, as the concept of enrichment doens't need to be exposed
export type ContactDTO = {
    id: string
    createdAt: number
    email: string
    firstName?: string | null | undefined
    lastName?: string | null | undefined
    organisation: string
}

export type ContactDetailsDTO = {
    id: string
    createdAt: number
    email: string
    emailStatus: EmailVerificationStatus
    firstName: string | null
    lastName: string | null
    location: string | null
    company: string | null
    profession: string | null
    enrichmentScore: number | null
    isEnriched: boolean
    organisation: string
}

export type ContactEnrichmentDetailsDTO = {
    id: string
    summary: string | null
    motivations: string | null
    communicationStyle: string | null
    potentialObjections: string | null
    engagementSuggestions: string | null
    organisation: string
}

export type ContactExportListItemDTO = {
    firstName: string | null
    lastName: string | null
    email: string
    emailStatus: EmailVerificationStatus | null
    city: string | null
    country: string | null
    region: string | null
    company: string | null
    profession: string | null
}

// TODO: replace usage with ContactListItemDTO
export type ContactListDTO = {
    id: string
    email: string
    emailStatus: EmailVerificationStatus
    firstName: string | null
    lastName: string | null
}

export type ContactListItemDTO = {
    id: string
    email: string
    emailStatus: EmailVerificationStatus | null
    firstName: string | null
    lastName: string | null
}
