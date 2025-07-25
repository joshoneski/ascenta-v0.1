'use client'

import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/client/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { useFormResetOnSuccessfulSubmit } from '@/client/hooks/use-form-reset-on-successful-submit'
import { api } from '@/client/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowRightIcon, LoaderCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValues = {
    email: string
    firstName: string
    lastName: string
}

const formSchema: z.Schema<FormValues> = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
})

export const CreateContactDialog = (props: {
    children?: React.ReactNode
    organisationId: string
}) => {
    const formId = useId()
    const router = useRouter()

    const [open, setOpen] = useState(false)

    const createContact = useMutation({
        mutationFn: api.contacts.create,
    })

    const form = useForm<FormValues>({
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
        },
        resolver: zodResolver(formSchema),
    })
    useFormResetOnSuccessfulSubmit(form)
    const { formState } = form

    async function handleSubmit(values: FormValues) {
        if (formState.isSubmitting) {
            return
        }

        const response = await createContact.mutateAsync({
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            organisation: props.organisationId,
        })

        if (!response.success) {
            toast.error(response.error.message)
            throw response.error
        }

        router.refresh()
        toast.success('Contact successfully created.')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Create contact</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id={formId}
                        className="space-y-8"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="jane@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jane" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button
                        form={formId}
                        type="submit"
                        disabled={createContact.isPending}
                    >
                        <span>Create</span>
                        {createContact.isPending ? (
                            <LoaderCircleIcon className="size-4 animate-spin" />
                        ) : (
                            <ArrowRightIcon className="size-4" />
                        )}
                    </Button>
                </DialogFooter>

                <DialogCloseButton />
            </DialogContent>
        </Dialog>
    )
}
