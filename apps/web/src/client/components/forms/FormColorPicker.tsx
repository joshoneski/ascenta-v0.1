'use client'

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Control, FieldValues, Path } from 'react-hook-form'

interface FormColorPickerProps<TFieldValues extends FieldValues> {
    className?: string
    control: Control<TFieldValues>
    controlClassName?: string
    description?: string
    inputClassname?: string
    label?: string
    name: Path<TFieldValues>
    placeholder: string
    type?: string
}

export function FormInput<TFieldValues extends FieldValues>({
    className,
    control,
    controlClassName,
    description,
    inputClassname,
    label,
    name,
    placeholder,
    type = 'text',
}: FormColorPickerProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl className={controlClassName}>
                        <Input
                            className={inputClassname}
                            type={type}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                </FormItem>
            )}
        />
    )
}
