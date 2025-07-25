import { CampaignEmailEntity } from '@/modules/campaigns/domain/campaign-email.entity'
import { CampaignEntity } from '@/modules/campaigns/domain/campaign.entity'
import { openai } from '@/server/_utils/openai'
import { BadRequestError, FatalError } from '@/shared/errors'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const strategySchema = z.object({
    sampleEmail: z.string(),
})

export async function improveCampaignEmailUseCase(
    campaign: CampaignEntity,
    campaignEmail: CampaignEmailEntity,
    improvements: string
) {
    if (campaignEmail.props.sentAt) {
        throw new BadRequestError('Past sent emails cannot be improved.')
    }

    return createContent(buildPrompt(campaign, campaignEmail, improvements))

    // TODO: create samples using createPersonalisedEmailUseCase?
}

async function createContent(prompt: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        temperature: 0.7,
        messages: [
            {
                content: prompt,
                role: 'developer',
            },
        ],
        response_format: zodResponseFormat(strategySchema, 'campaign_content'),
    })

    console.log('Improve Campaign Email Usage', completion.usage)

    const result = completion.choices.at(0)
    if (!result?.message?.parsed) {
        throw new FatalError('Failed to improve email content.')
    }

    return result.message.parsed
}

function buildPrompt(
    campaign: CampaignEntity,
    campaignEmail: CampaignEmailEntity,
    improvements: string
): string {
    return `
You are an expert email marketing strategist.

Given the following email campaign strategy:
Summary: ${campaign.props.summary}
Strategy: ${campaign.props.strategy}

And the following improvements:
${improvements}

Improve the following sample:
${campaignEmail.props.sample}

Important Constraints:
- DO NOT include a subject 
- DO NOT include a label (e.g., no subject:) in the output
`.trim()
}
