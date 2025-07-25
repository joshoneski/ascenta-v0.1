import { CampaignEntity } from '@/modules/campaigns/domain/campaign.entity'
import { openai } from '@/server/_utils/openai'
import { BadRequestError, FatalError } from '@/shared/errors'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const strategySchema = z.object({
    emails: z.array(
        z.object({
            day: z.number(),
            contentFocus: z.string(),
            purpose: z.string(),
            sampleEmail: z.string(),
            subject: z.string(),
        })
    ),
})

export async function createSmartCampaignContentUseCase(
    campaign: CampaignEntity,
    organisationName: string,
    organisationDescription: string
) {
    if (
        campaign.props.status !== 'draft' ||
        campaign.props.draftStep !== 'strategy'
    ) {
        throw new BadRequestError('Campaign strategy cannot be edited.')
    }

    return createContent(
        buildPrompt(campaign, organisationName, organisationDescription)
    )

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

    console.log('Create Smart Campaign Content Usage', completion.usage)

    const result = completion.choices.at(0)
    if (!result?.message?.parsed) {
        throw new FatalError('Failed to create smart campaign content.')
    }

    return result.message.parsed
}

function buildPrompt(
    campaign: CampaignEntity,
    organisationName: string,
    organisationDescription: string
): string {
    return `
You are an expert email marketing strategist.

Create a multi-part email campaign strategy based on the following brief:
Summary: ${campaign.props.summary}
Strategy: ${campaign.props.strategy}
Organisation name: ${organisationName}
Organisation description: ${organisationDescription}

Deliverables:

1. Email Schedule & Strategy
- Create a timeline of email sends over a 1–2 week period (or longer if relevant).
- For each email, describe:
   - Send timing (day/time)
   - Purpose (e.g. tell a story, explain impact, ask for support)
   - Content focus (e.g. a specific story, stat, testimonial, or action)
   
Important Constraints:
- DO NOT include a label (e.g., no subject:) in the output
`.trim()
}
