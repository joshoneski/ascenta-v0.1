import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

export function useFormResetOnSuccessfulSubmit(
    form: UseFormReturn<any, any, any>
) {
    const { formState, reset } = form

    useEffect(() => {
        reset()
    }, [formState.isSubmitSuccessful])
}
