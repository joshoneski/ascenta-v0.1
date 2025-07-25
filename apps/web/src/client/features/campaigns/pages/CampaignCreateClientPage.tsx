'use client'

import { FormInput } from '@/client/components/forms/FormInput'
import { FormSelect } from '@/client/components/forms/FormSelect'
import { FormTextArea } from '@/client/components/forms/FormTextarea'
import { KeynoteIllustration } from '@/client/components/illustrations/KeynoteIllustration'
import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import { Form } from '@/client/components/ui/form'
import { useCreateCampaign } from '@/client/features/campaigns/hooks/campaigns'
import { CampaignOptionDto } from '@/modules/campaigns'
import { DomainSenderDTO } from '@/modules/domains/domain-senders.types'
import { routes } from '@/shared/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    ArrowRightIcon,
    DicesIcon,
    LoaderCircleIcon,
    MailIcon,
    TargetIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

type Step = 'get-started' | 'create'

type FormValues = {
    brief: string
    ctaUrl: string
    segment: string
    sender: string
}

const formSchema: z.Schema<FormValues> = z.object({
    brief: z.string().min(1),
    ctaUrl: z.string().url(),
    segment: z.string().min(1, 'Select a segment of contacts.'),
    sender: z.string().min(1, 'Select who is sending the emails.'),
    // startDate: '',
})

export const CampaignCreateClientPage = (props: {
    organisationId: string
    organisationSlug: string
    segments: CampaignOptionDto[]
    domainSenders: DomainSenderDTO[]
}) => {
    const [step, setStep] = useState<Step>('get-started')

    function goToStep(step: Step) {
        return () => {
            setStep(step)
        }
    }

    return (
        <>
            {step === 'get-started' ? (
                <GetStartedStep goToNext={goToStep('create')} />
            ) : null}

            {step === 'create' ? (
                <CreateStep
                    organisationId={props.organisationId}
                    organisationSlug={props.organisationSlug}
                    segments={props.segments}
                    domainSenders={props.domainSenders}
                />
            ) : null}
        </>
    )
}

const GetStartedStep = (props: { goToNext: () => void }) => {
    return (
        <div className="grid gap-8 xl:grid-cols-2">
            <div className="max-w-[350px]">
                <Text as="h2" variant="h2">
                    Getting started
                </Text>
                <Text className="mt-2">
                    Let’s quickly review the new campaign process!
                </Text>

                <div className="mt-10 flex items-center gap-2">
                    <MailIcon className="size-4" />
                    <Text variant="h4">What we’re sending</Text>
                </div>
                <Text className="text-muted-foreground">
                    Each contact will receive a personalised campaign tailored
                    to their unique persona.
                </Text>

                <div className="mt-6 flex items-center gap-2">
                    <TargetIcon className="size-4" />
                    <Text variant="h4">Goals</Text>
                </div>
                <Text className="text-muted-foreground">
                    First off we’ll ask a few simple goals to help formulate the
                    strategy.
                </Text>

                <div className="mt-6 flex items-center gap-2">
                    <DicesIcon className="size-4" />
                    <Text variant="h4">Strategy</Text>
                </div>
                <Text className="text-muted-foreground">
                    Secondly, we’ll review and confirm the strategy. Tweak any
                    finer details here.
                </Text>

                <div className="mt-6 flex items-center gap-2">
                    <MailIcon className="size-4" />
                    <Text variant="h4">Comms</Text>
                </div>
                <Text className="text-muted-foreground">
                    Lastly, review sample emails in the sequence before taking
                    your campaign live.
                </Text>

                <Button
                    className="mt-6"
                    variant="accent"
                    onClick={props.goToNext}
                >
                    <span>Get started</span>
                    <ArrowRightIcon className="size-4" />
                </Button>
            </div>

            <div className="hidden xl:block">
                <KeynoteIllustration className="text-primary ml-auto" />
            </div>
        </div>
    )
}

const CreateStep = (props: {
    organisationId: string
    organisationSlug: string
    segments: CampaignOptionDto[]
    domainSenders: DomainSenderDTO[]
}) => {
    const router = useRouter()
    const createCampaign = useCreateCampaign()

    const form = useForm<FormValues>({
        defaultValues: {
            brief: '',
            ctaUrl: '',
            segment: '',
            sender: '',
            // startDate: '',
        },
        resolver: zodResolver(formSchema),
    })

    const handleSubmit: SubmitHandler<FormValues> = async (data) => {
        if (createCampaign.isPending) {
            return
        }

        const result = await createCampaign.mutateAsync({
            body: {
                brief: data.brief,
                ctaUrl: data.ctaUrl,
                segment: data.segment === 'all' ? null : data.segment,
                sender: data.sender,
            },
            organisation: props.organisationId,
        })

        router.push(
            routes.dashboard.campaigns.strategy(
                props.organisationSlug,
                result.id
            )
        )
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="lg:max-w-[350px]">
                <Text as="h2" variant="h2">
                    Details
                </Text>

                <Form {...form}>
                    <form
                        className="mt-4"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormSelect
                            control={form.control}
                            controlClassName="w-full"
                            label="Who's sending this?"
                            placeholder="Select sender"
                            name="sender"
                            values={props.domainSenders.map((sender) => ({
                                label: `${sender.name} <${sender.email}>`,
                                value: sender.id,
                            }))}
                            emptyState={
                                <div className="flex flex-col items-center gap-2 p-2 py-8">
                                    <Text
                                        className="text-center"
                                        variant="bodySm"
                                    >
                                        Add your domain to in the settings.
                                    </Text>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            router.push(
                                                routes.dashboard.settings.root(
                                                    props.organisationSlug
                                                )
                                            )
                                        }
                                    >
                                        Add domain
                                    </Button>
                                </div>
                            }
                        />

                        <FormSelect
                            className="mt-8"
                            control={form.control}
                            controlClassName="w-full"
                            label="Segment"
                            placeholder="Select a segment"
                            name="segment"
                            values={[
                                {
                                    label: 'All contacts',
                                    value: 'all',
                                },
                                ...props.segments.map((segment) => ({
                                    label: segment.name,
                                    value: segment.id,
                                })),
                            ]}
                            emptyState={
                                <div className="flex flex-col items-center gap-2 p-2 py-8">
                                    <Text
                                        className="text-center"
                                        variant="bodySm"
                                    >
                                        Add segments to group your contacts into
                                        lists.
                                    </Text>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            router.push(
                                                routes.dashboard.segments.root(
                                                    props.organisationSlug
                                                )
                                            )
                                        }
                                    >
                                        Add domain
                                    </Button>
                                </div>
                            }
                        />

                        <FormInput
                            className="mt-8"
                            control={form.control}
                            label="Donation link"
                            name="ctaUrl"
                            placeholder="https://donate.littlephil.org"
                        />

                        {/*<FormDatePicker*/}
                        {/*    className="mt-8"*/}
                        {/*    control={form.control}*/}
                        {/*    dateRange={{ start: subDays(new Date(), 1) }}*/}
                        {/*    label="Start date (optional)"*/}
                        {/*    name="startDate"*/}
                        {/*    placeholder="Select a date"*/}
                        {/*/>*/}

                        <FormTextArea
                            className="mt-8"
                            control={form.control}
                            label="Brief description of your campaign goals"
                            name="brief"
                            placeholder="Enter a few goals you’re looking to achieve"
                            textareaClassname="min-h-24"
                        />

                        <Button className="mt-6" variant="accent">
                            <span>Looks good</span>
                            {createCampaign.isPending ? (
                                <LoaderCircleIcon className="size-4 animate-spin" />
                            ) : (
                                <ArrowRightIcon className="size-4" />
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
