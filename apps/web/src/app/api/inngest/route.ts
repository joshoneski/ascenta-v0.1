import { inngest } from '@/modules/background-tasks/infrastructure/inngest-client'
import { inngestFunctions } from '@/modules/background-tasks/infrastructure/inngest-functions'
import { serve } from 'inngest/next'

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: inngestFunctions,
})
