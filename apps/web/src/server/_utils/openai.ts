import 'server-only'

import { backendConfig } from '@/server/backend-config'
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: backendConfig.OPENAI_API_KEY,
})
