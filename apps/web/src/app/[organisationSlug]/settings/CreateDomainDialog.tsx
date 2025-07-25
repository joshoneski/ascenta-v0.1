import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogCloseButton,
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
import { useCreateDomain } from '@/client/queries/domains'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon, LoaderCircleIcon } from 'lucide-react'
import { ReactNode, useId } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createFormSchema = z.object({
    domain: z.string().min(1),
})

export const CreateDomainDialog = (props: {
    children?: ReactNode
    organisationId: string
}) => {
    const formId = useId()

    const createDomain = useCreateDomain()

    const form = useForm<z.infer<typeof createFormSchema>>({
        defaultValues: {
            domain: '',
        },
        resolver: zodResolver(createFormSchema),
    })

    async function handleValidSubmit(values: z.infer<typeof createFormSchema>) {
        if (createDomain.isPending) {
            return
        }

        try {
            await createDomain.mutateAsync({
                organisation: props.organisationId,
                body: values,
            })
            toast.success('Domain created.')
        } catch (e) {
            toast.error((e as any).message || 'Failed to create domain.')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Add domain</DialogTitle>
                    <DialogDescription>
                        Add a custom domain to your organisation. Domains are
                        used to send emails to your contacts.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id={formId}
                        onSubmit={form.handleSubmit(handleValidSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="domain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domain</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="google.com"
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
                        {createDomain.isPending ? (
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
