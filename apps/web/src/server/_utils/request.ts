export type Actor = {
    id: string
    orgIds: string[]
    type: 'system' | 'user'
}

export type RequestContext = {
    actor: Actor
    organisation: {
        id: string
        // add plan in future
    } | null
    requestId: string
    source: 'api' | 'cron' | 'job' | 'page'
    // maybe timezone, locale, etc.
    // maybe even more later: featureFlags, region, locale, etc.
}
