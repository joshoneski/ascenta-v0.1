import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/client/components/ui/form'
import { Textarea } from '@/client/components/ui/textarea'
import { Control, FieldValues, Path } from 'react-hook-form'

interface FormTextareaProps<TFieldValues extends FieldValues> {
    className?: string
    control: Control<TFieldValues>
    controlClassName?: string
    description?: string
    label?: string
    name: Path<TFieldValues>
    placeholder: string
    textareaClassname?: string
}

export function FormTextArea<TFieldValues extends FieldValues>({
    className,
    control,
    controlClassName,
    description,
    label,
    name,
    placeholder,
    textareaClassname,
}: FormTextareaProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl className={controlClassName}>
                        <Textarea
                            className={textareaClassname}
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
