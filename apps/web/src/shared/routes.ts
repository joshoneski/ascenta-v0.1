export const routes = {
    dashboard: {
        root: (orgSlug: string) => `/${orgSlug}`,
        campaigns: {
            root: (orgSlug: string) => `/${orgSlug}/campaigns`,
            create: (orgSlug: string) => `/${orgSlug}/campaigns/create`,
            draft: {
                comms: (orgSlug: string, campaignId: string) =>
                    `/${orgSlug}/campaigns/${campaignId}/comms`,
                strategy: (orgSlug: string, campaignId: string) =>
                    `/${orgSlug}/campaigns/${campaignId}/strategy`,
            },
            strategy: (orgSlug: string, campaignId: string) =>
                `/${orgSlug}/campaigns/${campaignId}/strategy`,
            view: (orgSlug: string, campaignId: string) =>
                `/${orgSlug}/campaigns/${campaignId}`,
        },
        charities: {
            root: (orgSlug: string) => `/${orgSlug}/charities`,
        },
        contacts: {
            root: (orgSlug: string) => `/${orgSlug}/contacts`,
            enrich: (orgSlug: string, contactId: string) =>
                `/${orgSlug}/contacts/${contactId}/enrich`,
            view: (orgSlug: string, contactId: string) =>
                `/${orgSlug}/contacts/${contactId}`,
        },
        enrich: {
            root: (orgSlug: string) => `/${orgSlug}/enrich`,
        },
        segments: {
            root: (orgSlug: string) => `/${orgSlug}/segments`,
            create: (orgSlug: string) => `/${orgSlug}/segments/create`,
            view: (orgSlug: string, segmentId: string) =>
                `/${orgSlug}/segments/${segmentId}`,
        },
        settings: {
            root: (orgSlug: string) => `/${orgSlug}/settings`,
        },
    },
    click: (token: string) => `/c/${token}`,
    login: '/login',
    root: '/',
    organisations: '/organisations',
}
