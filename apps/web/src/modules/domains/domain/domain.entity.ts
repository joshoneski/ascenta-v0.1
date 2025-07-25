import { OrganisationId } from '@/server/organisations/organisation.entity'
import { ValueObject } from '@/shared/value-object'

export class DomainId extends ValueObject<string> {}

export class DomainEntity {
    constructor(
        public id: DomainId,
        public organisationId: OrganisationId,
        public domain: string,
        public resendDomainId: string,
        public createdAt: Date
    ) {}
}
