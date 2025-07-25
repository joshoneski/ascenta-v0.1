'use client'

import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { Input } from '@/client/components/ui/input'
import { Label } from '@/client/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/client/components/ui/select'
import { useCreateSegment } from '@/client/queries/segments'
import { SEGMENT_FIELDS, SEGMENT_OPERATORS } from '@/shared/dtos/segment.dto'
import { routes } from '@/shared/routes'
import { LoaderCircleIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Filter {
    id: string
    field: string
    operator: string
    value: string
}

export const SegmentCreateForm = (props: {
    organisationId: string
    organisationSlug: string
}) => {
    const [segmentName, setSegmentName] = useState('')
    const [filters, setFilters] = useState<Filter[]>([])

    const router = useRouter()
    const createSegment = useCreateSegment()

    const addFilter = () => {
        const newFilter: Filter = {
            id: Date.now().toString(),
            field: '',
            operator: '',
            value: '',
        }
        setFilters([...filters, newFilter])
    }

    const removeFilter = (id: string) => {
        // if (filters.length > 1) {
        setFilters(filters.filter((filter) => filter.id !== id))
        // }
    }

    const updateFilter = (id: string, key: keyof Filter, value: string) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id
                    ? {
                          ...filter,
                          [key]: value,
                          ...(key === 'field'
                              ? { operator: '', value: '' }
                              : {}),
                      }
                    : filter
            )
        )
    }

    const getFieldType = (fieldValue: string) => {
        const field = SEGMENT_FIELDS.find((f) => f.value === fieldValue)
        return field?.type || 'text'
    }

    const getOperatorsForField = (fieldValue: string) => {
        const fieldType = getFieldType(fieldValue)
        return (
            SEGMENT_OPERATORS[fieldType as keyof typeof SEGMENT_OPERATORS] ||
            SEGMENT_OPERATORS.text
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (createSegment.isPending) {
            return
        }

        const valid = filters.every(
            (filter) => filter.field && filter.operator && filter.value
        )
        if (!valid) {
            toast.error('One or more of your filters is incomplete.')
            return
        }

        const response = await createSegment.mutateAsync({
            organisation: props.organisationId,
            body: { name: segmentName, filters },
        })

        router.push(
            routes.dashboard.segments.view(props.organisationSlug, response.id)
        )
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>
                        Give your segment a descriptive name to identify it
                        later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div>
                            <Label htmlFor="segment-name">Name</Label>
                            <Input
                                id="segment-name"
                                placeholder="e.g. Young Professionals in Australia"
                                value={segmentName}
                                onChange={(e) => setSegmentName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </CardContent>

                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>
                        Add conditions to define which contacts belong to this
                        segment. All conditions must be met.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {filters.map((filter, index) => (
                        <div
                            key={filter.id}
                            className="flex items-end gap-4 rounded-lg border p-4"
                        >
                            <div className="flex-1">
                                <Label>Field</Label>
                                <Select
                                    onValueChange={(value) =>
                                        updateFilter(filter.id, 'field', value)
                                    }
                                    value={filter.field}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEGMENT_FIELDS.map((field) => (
                                            <SelectItem
                                                key={field.value}
                                                value={field.value}
                                            >
                                                {field.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1">
                                <Label>Operator</Label>
                                <Select
                                    value={filter.operator}
                                    onValueChange={(value) =>
                                        updateFilter(
                                            filter.id,
                                            'operator',
                                            value
                                        )
                                    }
                                    disabled={!filter.field}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select operator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getOperatorsForField(filter.field).map(
                                            (operator) => (
                                                <SelectItem
                                                    key={operator.value}
                                                    value={operator.value}
                                                >
                                                    {operator.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1">
                                <Label>Value</Label>
                                <Input
                                    placeholder="Enter value"
                                    value={filter.value}
                                    onChange={(e) =>
                                        updateFilter(
                                            filter.id,
                                            'value',
                                            e.target.value
                                        )
                                    }
                                    disabled={!filter.operator}
                                    type={
                                        getFieldType(filter.field) === 'number'
                                            ? 'number'
                                            : 'text'
                                    }
                                />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFilter(filter.id)}
                                className="shrink-0"
                            >
                                <Trash2Icon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addFilter}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Filter
                    </Button>
                </CardContent>

                <CardFooter className="flex justify-end gap-4">
                    <Button type="submit" disabled={!segmentName.trim()}>
                        {createSegment.isPending ? (
                            <LoaderCircleIcon className="size-4 animate-spin" />
                        ) : null}
                        Create segment
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
