import { backendConfig } from '@/server/backend-config'
import { IncomingWebhook } from '@slack/webhook'

const supportChannel = new IncomingWebhook(
    backendConfig.SLACK_SUPPORT_WEBHOOK_URL
)

export async function sendSlackSupportNotification(
    title: string,
    text: string
) {
    try {
        await supportChannel.send({
            attachments: [
                {
                    color: 'warning',
                    title,
                    text,
                },
            ],
        })
    } catch (err) {
        console.error('Failed to log to Slack channel', err)
    }
}
