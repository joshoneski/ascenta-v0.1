'use client'

import { Loader } from '@/client/components/Loader'
import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { UploadIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useId, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValues = {
    file: File
}

const formSchema: z.Schema<FormValues> = z.object({
    file: z.instanceof(File),
})

export function ImportContactsDialog(props: {
    children?: React.ReactNode
    organisationId: string
}) {
    const formId = useId()
    const router = useRouter()

    const [open, setOpen] = useState(false)

    const importContacts = useMutation({
        mutationFn: api.contacts.createMany,
    })

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })
    useFormResetOnSuccessfulSubmit(form)
    const { formState } = form

    const handleSubmit: SubmitHandler<FormValues> = async (data) => {
        if (formState.isSubmitting) {
            return
        }

        if (!data.file) {
            throw new Error('No file provided.')
        }

        const response = await importContacts.mutateAsync({
            file: data.file,
            organisation: props.organisationId,
        })

        if (!response.success) {
            toast.error(response.error.message)
            throw response.error
        }

        router.refresh()
        toast.success(
            `Contacts successfully imported. ${response.data.created} created and ${response.data.updated} updated.`
        )
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader className="items-start">
                    <DialogTitle>Import contacts</DialogTitle>
                    <DialogDescription>
                        Upload a CSV of contacts you would like to add. File can
                        include: email, first name, last name.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id={formId}
                        className="space-y-8"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="file"
                            render={({
                                field: { value, onChange, ...fieldProps },
                            }) => (
                                <FormItem>
                                    <FormLabel>File *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            type="file"
                                            onChange={(event) =>
                                                onChange(
                                                    event.target.files &&
                                                        event.target.files[0]
                                                )
                                            }
                                        />
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
                        disabled={importContacts.isPending}
                    >
                        <span>Import</span>
                        {importContacts.isPending ? (
                            <Loader size={16} />
                        ) : (
                            <UploadIcon className="size-4" />
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
