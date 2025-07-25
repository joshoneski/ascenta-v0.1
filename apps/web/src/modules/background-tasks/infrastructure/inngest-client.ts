import { backendConfig } from '@/server/backend-config'
import { EventSchemas, Inngest } from 'inngest'
import { z } from 'zod'

const isLocal = backendConfig.APP_ENV === 'local'

export const inngest = new Inngest({
    id: 'ascenta-plus',
    baseUrl: isLocal ? 'http://localhost:3202' : undefined,
    isDev: isLocal,
    schemas: new EventSchemas().fromZod({
        'campaign.email.delivery.scheduled': {
            data: z.object({
                campaignEmailDeliveryId: z.string(),
                organisationId: z.string(),
            }),
        },
        'contact.enrichment.scheduled': {
            data: z.object({
                taskId: z.string(),
                organisationId: z.string(),
            }),
        },
    }),
})
