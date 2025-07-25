export type CreateOrganisationParams = {
    displayName: string
    slug: string
    type: 'admin' | 'charity'
}

export type UpdateOrganisationParams = {
    displayName?: string
    slug?: string
    primaryColor?: string
}
