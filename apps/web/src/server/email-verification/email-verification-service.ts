import { backendConfig } from '@/server/backend-config'
import client from '@sendgrid/client'
import { ClientRequest } from '@sendgrid/client/src/request'

client.setApiKey(backendConfig.SENDGRID_API_KEY)

export class EmailVerificationService {
    async verifyDeliverability(email: string) {
        const data = {
            email,
        }

        const request: ClientRequest = {
            url: '/v3/validations/email',
            method: 'POST',
            body: data,
        }

        const [_, body] = await client.request(request)
        return (
            body.result.verdict === 'Valid' || body.result.verdict === 'Risky'
        )
    }
}
