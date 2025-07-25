export class ValueObject<TType> {
    protected _value: TType

    constructor(value: TType) {
        this.validate(value)
        this._value = value
    }

    get value() {
        return this._value
    }

    // Stub to override for custom validateion. Validation should throw when invalid.
    protected validate(value: TType): void {}
}
