import { domainsRecordsTableColumns } from '@/app/[organisationSlug]/settings/DomainsRecordsTableColumns'
import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import { Card } from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/client/components/ui/dialog'
import { useControllableState } from '@/client/hooks/useControllableState'
import { useVerifyDomain } from '@/client/queries/domains'
import { DomainListItemDTO } from '@/modules/domains'
import { Loader2Icon } from 'lucide-react'
import { ReactNode } from 'react'
import { toast } from 'sonner'

export const DomainDnsRecordsDialog = ({
    children,
    domainId,
    records,
    organisationId,
    ...props
}: {
    children?: ReactNode
    domainId: string
    records: DomainListItemDTO['records']
    organisationId: string
    open?: boolean
    setOpen?: (open: boolean) => void
}) => {
    const [open, setOpen] = useControllableState({
        defaultValue: false,
        onValueChange: props.setOpen,
        value: props.open,
    })

    const verifyDomain = useVerifyDomain()

    async function handleVerifyClick() {
        const response = await verifyDomain.mutateAsync({
            domain: domainId,
            organisation: organisationId,
        })

        if (!response.success) {
            toast.error(response.error.message)
            return
        }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>DNS Records</DialogTitle>
                </DialogHeader>

                <div>
                    <Text variant="h4">DKIM and SPF</Text>
                    <Text variant="bodySm">
                        Enable email signing and specify authorized senders.
                    </Text>
                </div>
                <Card>
                    <DataTable>
                        <DataTableHeader
                            columns={domainsRecordsTableColumns}
                            data={records}
                        />
                        <DataTableBody
                            columns={domainsRecordsTableColumns}
                            data={records}
                        />
                    </DataTable>
                </Card>

                <div>
                    <Text variant="h4">DMARC</Text>
                    <Text variant="bodySm">
                        Set authentication policies and receive reports.
                    </Text>
                </div>
                <Card>
                    <DataTable>
                        <DataTableHeader
                            columns={domainsRecordsTableColumns}
                            data={[
                                {
                                    record: 'DMARC',
                                    name: '_dmarc',
                                    type: 'TXT',
                                    ttl: 'Auto',
                                    status: 'Recommended',
                                    value: 'v=DMARC1; p=none;',
                                },
                            ]}
                        />
                        <DataTableBody
                            columns={domainsRecordsTableColumns}
                            data={[
                                {
                                    record: 'DMARC',
                                    name: '_dmarc',
                                    type: 'TXT',
                                    ttl: 'Auto',
                                    status: 'Recommended',
                                    value: 'v=DMARC1; p=none;',
                                },
                            ]}
                        />
                    </DataTable>
                </Card>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>

                    <Button onClick={handleVerifyClick}>
                        <span>Verify</span>
                        {verifyDomain.isPending ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : null}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
