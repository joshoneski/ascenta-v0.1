'use client'

import { Calendar } from '@/client/components/ui/calendar'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/client/components/ui/form'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface FormDatePickerProps<TFieldValues extends FieldValues> {
    className?: string
    control: Control<TFieldValues>
    controlClassName?: string
    dateRange?: {
        start?: Date
        end?: Date
    }
    label?: string
    name: Path<TFieldValues>
    placeholder: string
}

export function FormDatePicker<TFieldValues extends FieldValues>({
    className,
    control,
    controlClassName,
    dateRange,
    label,
    name,
    placeholder,
}: FormDatePickerProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl className={controlClassName}>
                                <button className="border-input selection:bg-primary selection:text-primary-foreground aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive flex h-9 w-full min-w-0 items-center rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-4">
                                    {field.value ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span className="text-muted-foreground">
                                            {placeholder}
                                        </span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                    if (!dateRange) {
                                        return false
                                    }

                                    return (
                                        (dateRange.start &&
                                            date < dateRange.start) ||
                                        (dateRange.end &&
                                            date > dateRange.end) ||
                                        false
                                    )
                                }}
                                captionLayout="dropdown"
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
