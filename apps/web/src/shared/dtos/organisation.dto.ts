export type OrganisationDTO = {
    id: string
    object: 'organisation'
    createdAt: number
    displayName: string
    slug: string
    primaryColor: string
    type: 'admin' | 'charity'
}

export type OrganisationDetailsDTO = {
    displayName: string
    slug: string
    primaryColor: string
}

export type OrganisationMemberListItemDTO = {
    id: string
    createdAt: number
    name: string
    email: string
}
