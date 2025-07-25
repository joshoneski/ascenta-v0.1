import { ValueObject } from '@/shared/value-object'

export class SegmentId extends ValueObject<string> {}

export class SegmentFilterId extends ValueObject<string> {}

export class SegmentEntity {
    constructor(
        public id: SegmentId,
        public name: string,
        public createdAt: Date
    ) {}
}

export class SegmentFilterEntity {
    constructor(
        public id: SegmentFilterId,
        public segmentId: SegmentId,
        public field: string,
        public operator: SegmentFilterOperator,
        public value: unknown,
        public createdAt: Date
    ) {}
}

export class SegmentFilterOperator {
    protected _value: '=' | '!=' | '>=' | '>' | '<' | '<='

    constructor(value: string) {
        const isValid = ['=', '!=', '>=', '>', '<', '<='].includes(value)
        if (!isValid) {
            throw new Error(`Invalid segment filter operator "${value}"`)
        }

        this._value = value as '=' | '!=' | '>=' | '>' | '<' | '<='
    }

    get value() {
        return this._value
    }
}
