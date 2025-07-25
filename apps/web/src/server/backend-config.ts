import 'server-only'

import { z } from 'zod'

export const backendConfig = z
    .object({
        APP_ENV: z.enum(['local', 'development', 'production']),
        APOLLO_API_KEY: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        HOST_DOMAIN: z.string(),
        POSTGRES_URL: z.string(),
        OPENAI_API_KEY: z.string(),
        RESEND_API_KEY: z.string(),
        SENDGRID_API_KEY: z.string(),
        SLACK_SUPPORT_WEBHOOK_URL: z.string(),
    })
    .parse({
        APP_ENV: process.env.APP_ENV,
        APOLLO_API_KEY: process.env.APOLLO_API_KEY,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        HOST_DOMAIN: process.env.HOST_DOMAIN,
        POSTGRES_URL: process.env.POSTGRES_URL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        SLACK_SUPPORT_WEBHOOK_URL: process.env.SLACK_SUPPORT_WEBHOOK_URL,
    })
