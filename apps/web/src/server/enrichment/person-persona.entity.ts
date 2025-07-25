import { ValueObject } from '@/shared/value-object'
import { PersonId } from './person.entity'

export type PersonPersonaEntityProps = {
    createdAt: Date
    id: PersonPersonaId
    person: PersonId
    summary: string
    motivations: string
    communicationStyle: string
    potentialObjections: string
    engagementSuggestions: string
}

export class PersonPersonaId extends ValueObject<string> {}

export class PersonPersonaEntity {
    public readonly props: PersonPersonaEntityProps

    constructor(props: PersonPersonaEntityProps) {
        this.props = { ...props }
    }
}
