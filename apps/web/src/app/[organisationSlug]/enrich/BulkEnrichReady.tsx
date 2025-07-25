'use client'

import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent } from '@/client/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/client/components/ui/dialog'
import { api, ApiError } from '@/client/lib/api'
import { CONTACT_ENRICHMENT_PRICE_CENTS } from '@/shared/constants'
import {
    LoaderCircleIcon,
    MailIcon,
    SparklesIcon,
    TargetIcon,
    UserCheckIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

export const BulkEnrichReady = (props: {
    contactsReadyToEnrich: number
    organisationId: string
}) => {
    return (
        <Card className="border-primary bg-primary text-primary-foreground">
            <CardContent>
                <Text variant="h2">Ready to enrich</Text>
                <Text className="mt-2">
                    You have {props.contactsReadyToEnrich} contacts ready to be
                    enriched. This process will:
                </Text>
                <ul className="mt-1 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                        <MailIcon className="h-3 w-3" />
                        Verify email deliverability
                    </li>
                    <li className="flex items-center gap-2">
                        <UserCheckIcon className="h-3 w-3" />
                        Fill in missing contact information
                    </li>
                    <li className="flex items-center gap-2">
                        <TargetIcon className="h-3 w-3" />
                        Create donor personas for personalised communication
                    </li>
                </ul>
                <BulkEnrichDialog
                    contactCount={props.contactsReadyToEnrich}
                    organisationId={props.organisationId}
                >
                    <Button className="mt-6" variant="subtle">
                        <SparklesIcon className="size-4" />
                        <span>Start enrichment</span>
                    </Button>
                </BulkEnrichDialog>
            </CardContent>
        </Card>
    )
}

const BulkEnrichDialog = (props: {
    children?: ReactNode
    contactCount: number
    organisationId: string
}) => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const totalPriceDollars =
        (props.contactCount * CONTACT_ENRICHMENT_PRICE_CENTS) / 100

    const priceEstimate = {
        contactCount: props.contactCount,
        formattedPrice: `$${totalPriceDollars.toFixed(2)}`,
        pricePerContactPerContact: CONTACT_ENRICHMENT_PRICE_CENTS / 100,
    }

    const startEnrichment = async () => {
        // TODO: use mutation and prevent on pending
        if (isLoading) {
            return
        }

        setIsLoading(true)

        try {
            const response = await api.contacts.bulkEnrich({
                organisation: props.organisationId,
            })

            if (!response.success) {
                toast.error(response.error.message)
                return
            }

            router.refresh()
        } catch (e: unknown) {
            if (e instanceof ApiError) {
                toast.error(e.message)
            } else {
                toast.error('Failed to start bulk enrichment.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Bulk enrich</DialogTitle>
                    <DialogDescription>
                        Review the estimated cost before enriching your contacts
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text
                                variant="bodySm"
                                className="text-muted-foreground"
                            >
                                Contacts
                            </Text>
                            <Text variant="h3">
                                {priceEstimate.contactCount.toLocaleString()}
                            </Text>
                        </div>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                        <Text
                            variant="bodySm"
                            className="text-muted-foreground"
                        >
                            Estimated cost
                        </Text>
                        <Text variant="h2" className="text-primary">
                            {priceEstimate.formattedPrice}
                        </Text>
                        <Text
                            variant="bodySm"
                            className="text-muted-foreground mt-1"
                        >
                            $
                            {priceEstimate.pricePerContactPerContact.toFixed(2)}{' '}
                            per contact per email
                        </Text>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={startEnrichment} disabled={isLoading}>
                        {isLoading ? (
                            <LoaderCircleIcon className="size-4 animate-spin" />
                        ) : (
                            <SparklesIcon className="size-4" />
                        )}
                        <span>Enrich</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
