import { Text } from '@/client/components/Text'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/client/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/client/components/ui/select'
import { ReactNode } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

interface FormSelectProps<TFieldValues extends FieldValues> {
    className?: string
    control: Control<TFieldValues>
    controlClassName?: string
    emptyState?: ReactNode
    label?: string
    name: Path<TFieldValues>
    placeholder: string
    values: {
        value: any
        label: any
    }[]
}

export function FormSelect<TFieldValues extends FieldValues>({
    className,
    control,
    controlClassName,
    emptyState,
    label,
    name,
    placeholder,
    values,
}: FormSelectProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl className={controlClassName}>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {values.length > 0
                                ? values.map((item) => (
                                      <SelectItem
                                          key={item.value}
                                          value={item.value}
                                      >
                                          {item.label}
                                      </SelectItem>
                                  ))
                                : null}

                            {values.length == 0 ? (
                                emptyState ? (
                                    emptyState
                                ) : (
                                    <div className="px-2 py-8">
                                        <Text
                                            className="text-center"
                                            variant="bodySm"
                                        >
                                            No items to select from.
                                        </Text>
                                    </div>
                                )
                            ) : null}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
