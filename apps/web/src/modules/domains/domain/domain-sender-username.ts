import { BadRequestError } from '@/shared/errors'
import { ValueObject } from '@/shared/value-object'

const regex = /^([^@]+)$/

export class DomainSenderUsername extends ValueObject<string> {
    protected validate(value: string) {
        value = value.toLowerCase()
        if (!regex.test(value)) {
            throw new BadRequestError(`Invalid domain username: "${value}".`)
        }
    }
}
