'use client'

import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import {
    useOrganisationDetails,
    useUpdateOrganisationDetails,
} from '@/client/queries/organisations'
import { getDirtyValues } from '@/client/utils/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    displayName: z.string(),
    slug: z.string(),
})

export const SettingsGeneralTab = (props: { organisationId: string }) => {
    const organisation = useOrganisationDetails({
        organisation: props.organisationId,
    })

    const updateOrganisationDetails = useUpdateOrganisationDetails()

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            displayName: '',
            slug: '',
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        if (organisation.data) {
            form.reset(organisation.data)
        }
    }, [organisation.data])

    async function handleValidSubmit(values: z.infer<typeof formSchema>) {
        if (updateOrganisationDetails.isPending) {
            return
        }

        try {
            await updateOrganisationDetails.mutateAsync({
                organisation: props.organisationId,
                update: getDirtyValues(values, form.formState.dirtyFields),
            })
            toast.success('Organisation details updated.')
        } catch (e) {
            toast.error(
                (e as any).message || 'Failed to update organisation details.'
            )
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                    Manage your team's basic information and preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleValidSubmit)}
                        className="grid gap-8 md:grid-cols-2"
                    >
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organisation name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                organisation.isLoading
                                                    ? 'Loading...'
                                                    : 'Ascenta'
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Handle</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                organisation.isLoading
                                                    ? 'Loading...'
                                                    : 'ascenta'
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
