import { openai } from '@/server/_utils/openai'
import { FatalError } from '@/shared/errors'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const strategySchema = z.object({
    title: z.string(),
    strategy: z.string(),
    summary: z.string(),
    emails: z.array(
        z.object({
            day: z.number(),
            contentFocus: z.string(),
            purpose: z.string(),
            sample: z.string(),
        })
    ),
})

export async function createSmartCampaignStrategyUseCase(
    brief: string,
    charityName: string,
    charityDescription: string
) {
    return createStrategy(buildPrompt(brief, charityName, charityDescription))
}

async function createStrategy(prompt: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        temperature: 0.7,
        messages: [
            {
                content: prompt,
                role: 'developer',
            },
        ],
        response_format: zodResponseFormat(strategySchema, 'campaign_strategy'),
    })

    console.log('Create Smart Campaign Strategy Usage', completion.usage)

    const result = completion.choices.at(0)
    if (!result?.message?.parsed) {
        throw new FatalError('Failed to create smart campaign strategy.')
    }

    return result.message.parsed
}

function buildPrompt(
    brief: string,
    charityName: string,
    charityDescription: string
): string {
    return `
You are an expert email marketing strategist.

Create a multi-part email campaign strategy based on the following brief:
Goal: ${brief}
Charity name: ${charityName}
Charity description: ${charityDescription}

Deliverables:

1. Campaign Summary
- Purpose: What this campaign is trying to achieve beyond the core goal (e.g. increase engagement, build empathy, drive donations).
- Tone & Voice: How the campaign should sound (e.g. hopeful, urgent, compassionate).
- Core Message: The central idea or emotion the campaign should consistently reinforce.
  `.trim()
}
