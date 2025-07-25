import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/client/components/ui/dialog'
import { Input } from '@/client/components/ui/input'
import { Label } from '@/client/components/ui/label'
import { useCreateDomainSender } from '@/client/queries/domains'
import { Loader2Icon } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'

export const CreateDomainSenderDialog = ({
    children,
    domain,
    domainId,
    organisationId,
}: {
    children?: ReactNode
    domain: string
    domainId: string
    organisationId: string
}) => {
    const [open, setOpen] = useState(false)
    const [senderName, setSenderName] = useState('')
    const [senderPrefix, setSenderPrefix] = useState('')
    const [isValid, setIsValid] = useState(false)

    const createDomainSender = useCreateDomainSender()

    const fullEmail = senderPrefix ? `${senderPrefix}@${domain}` : `@${domain}`

    useEffect(() => {
        const emailPrefixRegex = /^[a-zA-Z0-9._-]+$/
        const isValidEmail =
            senderPrefix.length > 0 && emailPrefixRegex.test(senderPrefix)
        const isValidName = senderName.trim().length > 0
        setIsValid(isValidEmail && isValidName)
    }, [senderName, senderPrefix])

    const handleAttach = async () => {
        if (!isValid) {
            return
        }

        const response = await createDomainSender.mutateAsync({
            domain: domainId,
            organisation: organisationId,
            body: {
                senderName,
                senderUsername: senderPrefix,
            },
        })

        if (!response.success) {
            toast.error(response.error.message)
            return
        }

        setOpen(false)
        setSenderPrefix('')
        setSenderName('')
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open)
        if (open) {
            setSenderPrefix('')
            setSenderName('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Attach Sender to Domain</DialogTitle>
                    <DialogDescription>
                        Create a sender email address for the domain{' '}
                        <span className="font-mono font-medium">{domain}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sender-name">Sender name</Label>
                        <Input
                            id="sender-name"
                            placeholder="Support Team"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sender-prefix">Email address</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="sender-prefix"
                                placeholder="noreply"
                                value={senderPrefix}
                                onChange={(e) =>
                                    setSenderPrefix(e.target.value)
                                }
                                className="flex-1"
                            />
                            <span className="text-muted-foreground">
                                @{domain}
                            </span>
                        </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                        <Label className="text-sm font-medium">Preview</Label>
                        <p className="mt-1 font-mono text-sm">
                            {senderName && senderPrefix
                                ? `${senderName} <${fullEmail}>`
                                : fullEmail}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAttach} disabled={!isValid}>
                        <span>Attach Sender</span>
                        {createDomainSender.isPending ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : null}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
