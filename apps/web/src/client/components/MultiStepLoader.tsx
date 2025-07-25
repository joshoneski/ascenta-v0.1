'use client'

import { AnimatedEllipsisText } from '@/client/components/AnimatedEllipsisText'
import { LoadingIllustration } from '@/client/components/illustrations/LoadingIllustration'
import { Text } from '@/client/components/Text'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/client/components/ui/dialog'
import { cn } from '@/client/lib/utils'
import { CheckCircle2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const MultiStepLoader = (props: {
    isLoading?: boolean
    steps: { text: string; duration: number }[]
}) => {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (!props.isLoading) {
            return
        }

        const step = props.steps[currentStep]
        if (!step || currentStep + 1 >= props.steps.length) {
            return
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prevStep) => prevStep + 1)
        }, step.duration)

        return () => clearTimeout(timeout)
    }, [currentStep, props.isLoading, props.steps])

    useEffect(() => {
        if (props.isLoading) {
            setCurrentStep(0)
        }
    }, [props.isLoading])

    return (
        <Dialog open={props.isLoading}>
            <DialogContent
                className="p-12"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle asChild>
                        <LoadingIllustration className="text-primary mx-auto" />
                    </DialogTitle>
                </DialogHeader>

                <div className="mx-auto space-y-1">
                    {props.steps.map((step, index) => {
                        return (
                            <div
                                key={step.text}
                                className={cn(
                                    'text-muted-foreground flex items-center gap-2',
                                    {
                                        'text-primary': index < currentStep,
                                        'text-accent': index === currentStep,
                                    }
                                )}
                            >
                                <CheckCircle2Icon />
                                <Text variant="h3">
                                    {step.text}
                                    <AnimatedEllipsisText
                                        key={step.text}
                                        isLoading={index === currentStep}
                                    />
                                </Text>
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}
