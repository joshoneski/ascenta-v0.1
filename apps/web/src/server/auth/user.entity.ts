import { ValueObject } from '@/shared/value-object'

export class UserId extends ValueObject<string> {}

export class UserEntity {
    constructor(
        public id: UserId,
        public email: string,
        public name: string
    ) {}
}
