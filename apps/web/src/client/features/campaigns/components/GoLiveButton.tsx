'use client'

import { Button } from '@/client/components/ui/button'
import { CampaignPriceDialog } from '@/client/features/campaigns/components/CampaignPriceDialog'
import { api } from '@/client/lib/api'
import { PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface GoLiveButtonProps {
    campaignId: string
    organisationId: string
}

export const GoLiveButton = (props: GoLiveButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [showPriceDialog, setShowPriceDialog] = useState(false)
    const router = useRouter()

    const handleGoLive = async () => {
        setIsLoading(true)

        try {
            const response = await api.campaigns.launch({
                body: {},
                campaign: props.campaignId,
                organisation: props.organisationId,
            })

            if (!response.success) {
                toast.error(response.error.message)
                return
            }

            toast.success('Your campaign is now live and sending emails.')
            setShowPriceDialog(false)
            router.refresh()
        } catch (e: unknown) {
            toast.error('Failed to launch campaign')
        } finally {
            setIsLoading(false)
        }
    }

    const handleButtonClick = () => {
        setShowPriceDialog(true)
    }

    return (
        <>
            <Button
                onClick={handleButtonClick}
                disabled={isLoading}
                variant="default"
                size="default"
            >
                <PlayIcon className="size-4" />
                <span>Go Live</span>
            </Button>

            <CampaignPriceDialog
                open={showPriceDialog}
                onOpenChange={setShowPriceDialog}
                campaignId={props.campaignId}
                organisationId={props.organisationId}
                onConfirm={handleGoLive}
            />
        </>
    )
}
