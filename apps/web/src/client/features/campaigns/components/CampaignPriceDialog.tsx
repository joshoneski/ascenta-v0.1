'use client'

import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/client/components/ui/dialog'
import { api } from '@/client/lib/api'
import { CampaignPriceEstimateDTO } from '@/shared/dtos/campaign-price-estimate.dto'
import { LoaderCircleIcon, PlayIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CampaignPriceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    campaignId: string
    organisationId: string
    onConfirm: () => void
}

export const CampaignPriceDialog = ({
    open,
    onOpenChange,
    campaignId,
    organisationId,
    onConfirm,
}: CampaignPriceDialogProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [priceEstimate, setPriceEstimate] =
        useState<CampaignPriceEstimateDTO | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            loadPriceEstimate()
        }
    }, [open, campaignId, organisationId])

    const loadPriceEstimate = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await api.campaigns.estimatePrice({
                campaign: campaignId,
                organisation: organisationId,
            })

            if (result.success) {
                setPriceEstimate(result.data)
            } else {
                setError('Failed to load price estimate')
            }
        } catch (error) {
            setError('Failed to load price estimate')
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirm = () => {
        onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Launch Campaign</DialogTitle>
                    <DialogDescription>
                        Review the estimated cost before launching your campaign
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <LoaderCircleIcon className="text-muted-foreground size-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="py-4">
                        <Text className="text-destructive">{error}</Text>
                    </div>
                ) : priceEstimate ? (
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
                            <div>
                                <Text
                                    variant="bodySm"
                                    className="text-muted-foreground"
                                >
                                    Emails per contact
                                </Text>
                                <Text variant="h3">
                                    {priceEstimate.emailCount.toLocaleString()}
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
                                {(
                                    priceEstimate.pricePerContactPerEmail / 100
                                ).toFixed(2)}{' '}
                                per contact per email
                            </Text>
                        </div>

                        <div className="rounded-lg bg-amber-50 p-3">
                            <Text variant="bodySm" className="text-amber-800">
                                This is an estimate. Final cost may vary based
                                on deliverability.
                            </Text>
                        </div>
                    </div>
                ) : null}

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !!error}
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircleIcon className="size-4 animate-spin" />
                                <span>Estimating...</span>
                            </>
                        ) : (
                            <>
                                <PlayIcon className="size-4" />
                                <span>Confirm & Launch</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
