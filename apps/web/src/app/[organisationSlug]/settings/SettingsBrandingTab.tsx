'use client'

import { FormInput } from '@/client/components/forms/FormInput'
import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import { Form } from '@/client/components/ui/form'
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
    primaryColor: z.string(),
})

export const SettingsBrandingTab = (props: { organisationId: string }) => {
    const organisation = useOrganisationDetails({
        organisation: props.organisationId,
    })

    const updateOrganisationDetails = useUpdateOrganisationDetails()

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            primaryColor: '#000000',
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        if (organisation.data) {
            form.reset({
                primaryColor: organisation.data.primaryColor,
            })
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
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                    Customise your team's appearance and branding.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleValidSubmit)}
                        className="grid gap-8 md:grid-cols-2"
                    >
                        <FormInput
                            control={form.control}
                            label="Primary color"
                            name="primaryColor"
                            description="Background color for email buttons."
                            placeholder="#000000"
                            type="color"
                        />

                        <div className="md:col-span-2">
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
