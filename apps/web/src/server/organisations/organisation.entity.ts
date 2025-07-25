import { UserId } from '@/server/auth/user.entity'
import { ValueObject } from '@/shared/value-object'

export class OrganisationId extends ValueObject<string> {}
export class OrganisationDomainId extends ValueObject<string> {}
export class OrganisationMemberId extends ValueObject<string> {}

export class OrganisationEntity {
    constructor(
        public id: OrganisationId,
        public displayName: string,
        public slug: string,
        public primaryColor: string, // TODO: regex
        public type: 'admin' | 'charity',
        public createdAt: Date
    ) {}
}

export class OrganisationDomainEntity {
    constructor(
        public id: OrganisationDomainId,
        public organisationId: OrganisationId,
        public resendDomainId: string,
        public createdAt: Date
    ) {}
}

export class OrganisationMemberEntity {
    constructor(
        public id: OrganisationMemberId,
        public organisationId: OrganisationId,
        public userId: UserId,
        public createdAt: Date
    ) {}
}
