import {
    PersonEnrichmentScore,
    PersonId,
} from '@/server/enrichment/person.entity'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { ValueObject } from '@/shared/value-object'

export class ContactId extends ValueObject<string> {}

export class ContactEntity {
    constructor(
        public id: ContactId,
        public organisationId: OrganisationId,
        public personId: PersonId | null,
        public email: string,
        public firstName: string | null,
        public lastName: string | null,
        public createdAt: Date
    ) {}
}

export class EnrichedContactId extends ValueObject<string> {}

export class EnrichedContactEntity {
    constructor(
        public id: EnrichedContactId,
        public organisationId: OrganisationId,
        public personId: PersonId | null,
        public email: string,
        public firstName: string | null,
        public lastName: string | null,
        public createdAt: Date,
        public city: string | null,
        public country: string | null,
        public region: string | null,
        public company: string | null,
        public profession: string | null,
        public enrichmentScore: PersonEnrichmentScore | null
    ) {}

    get isDueForFreshEnrichment() {
        return false // TODO: check last enrichment date
    }

    get fullName() {
        return [this.firstName, this.lastName].filter(Boolean).join(' ')
    }

    get location() {
        const locationParts: string[] = []
        if (this.city) {
            locationParts.push(this.city)
        }
        if (this.region) {
            locationParts.push(this.region)
        }
        if (this.country) {
            locationParts.push(this.country)
        }

        if (locationParts.length === 0) {
            return null
        }
        return locationParts.join(', ')
    }
}
