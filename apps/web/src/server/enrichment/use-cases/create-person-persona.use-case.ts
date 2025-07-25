import { db } from '@/db'
import { personPersonas } from '@/db/schema'
import { openai } from '@/server/_utils/openai'
import { personPersonaAdapters } from '@/server/enrichment/person.adapter'
import { PersonEntity } from '@/server/enrichment/person.entity'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const personaSchema = z.object({
    summary: z.string(),
    motivations: z.string(),
    communicationStyle: z.string(),
    potentialObjections: z.string(),
    engagementSuggestions: z.string(),
})

export async function createPersonPersonaUseCase(person: PersonEntity) {
    const prompt = buildPrompt(person)
    if (!prompt) {
        return null
    }

    const result = await createPersona(prompt)

    const [persona] = await db
        .insert(personPersonas)
        .values([
            {
                ...result,
                personId: person.props.id.value,
            },
        ])
        .returning()
    if (!persona) {
        throw new Error('Failed to create persona.')
    }

    return personPersonaAdapters.dbToEntity(persona)
}

async function createPersona(prompt: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        temperature: 0.7,
        messages: [
            {
                content: prompt,
                role: 'developer',
            },
        ],
        response_format: zodResponseFormat(personaSchema, 'persona'),
    })

    console.log('Create Persona Usage', completion.usage)

    const result = completion.choices.at(0)
    if (!result?.message?.parsed) {
        throw new Error('Failed to generate persona.')
    }

    return result.message.parsed
}

function buildPrompt(person: PersonEntity): string | null {
    const { firstName, company, profession } = person.props
    const location = person.location

    if (!location && (!company || !profession)) {
        return null
    }

    return `
Create a persona/profile to help a fundraiser understand how to best approach ${firstName ?? 'this person'} for a charity donation.

Details:
- Name: ${person.fullName ?? 'unknown'}
- Profession: ${profession ?? 'unknown'}
- Company: ${company ?? 'unknown'}
- Location: ${location ?? 'unknown'}

Important Constraints:
- Do not include a list of the provided details.
- Do not include a header for the short summary.
- Provide a short summary of the their motivations, communication style, potential objections and engagement suggestions.
- Provide a section and describe for their motivations, communication style, potential objections and engagement suggestions.
- Provide suggestions on how to engage them effectively.
- Each section should be around 256 characters.
  `.trim()
}
