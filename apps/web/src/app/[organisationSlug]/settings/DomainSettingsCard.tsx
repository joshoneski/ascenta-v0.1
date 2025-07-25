import { CreateDomainSenderDialog } from '@/app/[organisationSlug]/settings/CreateDomainSenderDialog'
import { DomainDnsRecordsDialog } from '@/app/[organisationSlug]/settings/DomainDnsRecordsDialog'
import { domainSenderTableColumns } from '@/app/[organisationSlug]/settings/DomainSenderTableColumns'
import { DomainStatusBadge } from '@/app/[organisationSlug]/settings/DomainStatusBadge'
import { Text } from '@/client/components/Text'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/client/components/ui/alert'
import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/client/components/ui/card'
import {
    DataTable,
    DataTableBody,
    DataTableHeader,
} from '@/client/components/ui/data-table'
import { DomainListItemDTO } from '@/modules/domains'
import { Loader2Icon, SettingsIcon, TriangleAlertIcon } from 'lucide-react'
import { useState } from 'react'

export const DomainSettingsCard = ({
    domain,
    organisationId,
}: {
    domain: DomainListItemDTO
    organisationId: string
}) => {
    const [dnsRecordsOpen, setDnsRecordsOpen] = useState(false)

    return (
        <Card key={domain.id}>
            <CardHeader>
                {domain.status === 'pending' ? (
                    <Alert className="mb-2" variant="warning">
                        <Loader2Icon className="animate-spin" />
                        <AlertTitle>
                            Looking for DNS records in your domain provider...
                        </AlertTitle>
                        <AlertDescription>
                            It may take a few minutes or hours, depending on the
                            DNS provider propagation time.
                        </AlertDescription>
                    </Alert>
                ) : null}

                {domain.status === 'not_started' ? (
                    <Alert className="mb-2" variant="warning">
                        <TriangleAlertIcon />
                        <AlertTitle>DNS Verification Required</AlertTitle>
                        <AlertDescription>
                            To verify ownership of your domain, add the
                            following DNS record with your domain provider.
                        </AlertDescription>
                        <div className="mt-2">
                            <Button
                                size="sm"
                                onClick={() => setDnsRecordsOpen(true)}
                            >
                                View DNS Records
                            </Button>
                        </div>
                    </Alert>
                ) : null}

                <div className="flex flex-row items-center gap-2">
                    <CardTitle>{domain.domain}</CardTitle>
                    <DomainStatusBadge status={domain.status} />
                    <div className="grow" />
                    <DomainDnsRecordsDialog
                        domainId={domain.id}
                        records={domain.records}
                        organisationId={organisationId}
                        open={dnsRecordsOpen}
                        setOpen={setDnsRecordsOpen}
                    >
                        <SettingsIcon className="cursor-pointer" />
                    </DomainDnsRecordsDialog>
                </div>
            </CardHeader>
            <CardContent>
                <Text>Senders</Text>

                <Card>
                    <DataTable>
                        <DataTableHeader
                            columns={domainSenderTableColumns}
                            data={domain.senders}
                        />
                        <DataTableBody
                            columns={domainSenderTableColumns}
                            data={domain.senders}
                        />
                    </DataTable>
                </Card>

                <CreateDomainSenderDialog
                    domain={domain.domain}
                    domainId={domain.id}
                    organisationId={organisationId}
                >
                    <Button className="mt-2">Add sender</Button>
                </CreateDomainSenderDialog>
            </CardContent>
        </Card>
    )
}
