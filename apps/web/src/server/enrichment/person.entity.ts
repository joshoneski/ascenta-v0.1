import { PersonPersonaEntity } from '@/server/enrichment/person-persona.entity'
import { ValueObject } from '@/shared/value-object'

export type PersonEntityProps = {
    id: PersonId
    createdAt: Date
    email: string
    firstName: string | null
    lastName: string | null
    city: string | null
    country: string | null
    region: string | null
    company: string | null
    profession: string | null
    enrichmentScore: PersonEnrichmentScore
}

export class PersonId extends ValueObject<string> {}

export class PersonEnrichmentScore extends ValueObject<number> {
    constructor(score: number) {
        super(score)
        if (score < 0 || score > 100) {
            throw new Error('Invalid enrichment score.')
        }
        this._value = Math.round(score)
    }
}

export class PersonEntity {
    public readonly props: PersonEntityProps

    constructor(props: PersonEntityProps) {
        this.props = { ...props }
    }

    calculateEnrichmentScore(personPersona: PersonPersonaEntity | null) {
        let weight = (
            Object.keys(this.props) as Array<keyof PersonEntityProps>
        ).reduce((acc, key) => {
            if (this.props[key]) {
                acc += ENRICHMENT_SCORE_WEIGHT[key]
            }
            return acc
        }, 0)

        if (personPersona) {
            weight += PERSONA_ENRICHMENT_SCORE_WEIGHT
        }

        this.props.enrichmentScore = new PersonEnrichmentScore(
            (weight / TOTAL_ENRICHMENT_SCORE_WEIGHT) * 100
        )
    }

    get isDueForFreshEnrichment() {
        return false // TODO: check last enrichment date
    }

    get fullName() {
        return [this.props.firstName, this.props.lastName]
            .filter(Boolean)
            .join(' ')
    }

    get location() {
        const locationParts: string[] = []
        if (this.props.city) {
            locationParts.push(this.props.city)
        }
        if (this.props.region) {
            locationParts.push(this.props.region)
        }
        if (this.props.country) {
            locationParts.push(this.props.country)
        }

        if (locationParts.length === 0) {
            return null
        }
        return locationParts.join(', ')
    }
}

const ENRICHMENT_SCORE_WEIGHT: Record<keyof PersonEntityProps, number> = {
    id: 0,
    email: 0,
    firstName: 20,
    lastName: 35,
    city: 10,
    country: 10,
    region: 10,
    company: 10,
    profession: 10,
    enrichmentScore: 0,
    createdAt: 0,
}

const PERSONA_ENRICHMENT_SCORE_WEIGHT = 40

const TOTAL_ENRICHMENT_SCORE_WEIGHT =
    Object.values(ENRICHMENT_SCORE_WEIGHT).reduce((a, b) => a + b) +
    PERSONA_ENRICHMENT_SCORE_WEIGHT
