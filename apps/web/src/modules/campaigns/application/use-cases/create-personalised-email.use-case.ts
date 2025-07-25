import { openai } from '@/server/_utils/openai'
import { FatalError } from '@/shared/errors'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const emailSchema = z.object({
    subject: z.string(),
    blocks: z.array(
        z.union([
            z.object({
                type: z.literal('title'),
                text: z.string(),
            }),
            z.object({
                type: z.literal('paragraph'),
                text: z.string(),
            }),
            z.object({
                type: z.literal('button'),
                text: z.string(),
            }),
        ])
    ),
})

export async function createPersonalisedEmailUseCase(params: {
    contactFirstName: string | null
    charityName: string
    sample: string | null
    contentFocus: string | null
    strategy: string
    summary: string
}) {
    const prompt = buildPrompt(
        params.contactFirstName,
        params.charityName,
        params.contentFocus,
        params.summary,
        params.strategy,
        params.sample
    )

    return createEmail(prompt)
}

async function createEmail(prompt: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        temperature: 0.7,
        messages: [
            {
                content: prompt,
                role: 'developer',
            },
        ],
        response_format: zodResponseFormat(emailSchema, 'personal_email'),
    })

    console.log('Create Personalised Email Usage', completion.usage)

    const result = completion.choices.at(0)
    if (!result?.message?.parsed) {
        throw new FatalError('Failed to generate persona.')
    }

    return result.message.parsed
}

function buildPrompt(
    contactFirstName: string | null,
    charityName: string,
    contentFocus: string | null,
    summary: string,
    strategy: string,
    sampleEmail: string | null
): string {
    return `
You are an expert email marketing strategist.

---
Instructions:
Using the details below, craft a fully written, personalised email. The message should reflect a natural, human tone tailored to the audience and purpose. The message should come from an organisation and not an individual.

---
Output Requirements:
1. A complete personalised email that includes:
- An engaging subject line
- A compelling introduction
- A clear body with strategic messaging
- A persuasive call to action that will link to a donation page

2. Multi-part email blocks for things like:
- title
- paragraph
- button

---
Important Constraints:
- ALWAYS make the title the first block
- ALWAYS make the title different than the subject
- ALWAYS if the contact's first name is provided, add a short greeting paragraph
- ALWAYS keep the button text 3 or less words
- ALWAYS add sign-off paragraphs including the charity name as the last blocks (e.g. "The ${charityName} Team")
- NEVER include the contacts name in a title block
- NEVER provide an example as there is no images to support
- NEVER use any placeholders or variables (e.g., no {{firstName}} or [firstName])
- NEVER use templated language
- NEVER use any new lines in the output
- NEVER begin or end any section with blank lines
- NEVER use filler phrases like "I hope this email finds you well" "At ${charityName}" or any formal cliches
- NEVER use "At ${charityName}" phrase
- NEVER sound robotic, corporate, or overly polished — favour clarity, empathy, and personality

---
Inputs:
${contactFirstName ? 'Contact first name:\n' + contactFirstName : ''}

Charity name:
${charityName}

Summary:
${summary}

Strategy:
${strategy}

${contentFocus ? 'Content Focus:\n' + contentFocus : ''}

${sampleEmail ? 'Sample email:\n' + sampleEmail : ''}
`.trim()
}
