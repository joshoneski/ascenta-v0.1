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
import { api } from '@/client/lib/api'
import { routes } from '@/shared/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useId } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValues = {
    name: string
    slug: string
}

const formSchema: z.Schema<FormValues> = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
})

export const CreateOrganisationDialog = (props: {
    children?: React.ReactNode
}) => {
    const formId = useId()
    const router = useRouter()

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            slug: '',
        },
        resolver: zodResolver(formSchema),
    })

    async function handleSubmit(values: FormValues) {
        const response = await api.organisations.create({
            name: values.name,
            slug: values.slug,
        })

        if (!response.success) {
            toast.error(response.error.message)
            return
        }

        toast.success('Organisation successfully created.')
        router.push(routes.dashboard.root(response.data.slug))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Create organisation</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id={formId}
                        className="space-y-8"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organisation name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Salvation Army"
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
                                    <FormLabel>Organisation handle</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="salvation-army"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button form={formId} type="submit">
                        <span>Create</span>
                        {/*<LoaderCircleIcon className="size-4 animate-spin" />*/}
                        <ArrowRightIcon className="size-4" />
                    </Button>
                </DialogFooter>

                <DialogCloseButton />
            </DialogContent>
        </Dialog>
    )
}
