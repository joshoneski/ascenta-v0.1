import { useState } from 'react'

export const useControllableState = <S>(params: {
    defaultValue: S
    onValueChange?: (value: S) => void
    value?: S
}) => {
    const [internalValue, setInternalValue] = useState(params.defaultValue)

    const value = params.value ?? internalValue

    const handleValueChange = (value: S) => {
        if (params.onValueChange) {
            params.onValueChange(value)
        }

        const isControlled = typeof params.value !== 'undefined'
        if (!isControlled) {
            setInternalValue(value)
        }
    }

    return [value, handleValueChange] as const
}
