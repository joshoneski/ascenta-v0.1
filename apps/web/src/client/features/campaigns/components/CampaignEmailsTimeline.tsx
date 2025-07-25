'use client'

import { Text } from '@/client/components/Text'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/client/components/ui/accordion'
import { Button } from '@/client/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/client/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/client/components/ui/tooltip'
import { EmailPreviewer } from '@/client/core/components/EmailPreviewer'
import { PopoverTextarea } from '@/client/core/components/forms/PopoverTextarea'
import { cn } from '@/client/lib/utils'
import { CampaignEmailDTO } from '@/modules/campaigns'
import { Text as EmailText } from '@ascenta-plus/emails/components/Text'
import { BasicEmail } from '@ascenta-plus/emails/emails/BasicEmail'
import { useCampaignEmailImprove } from '../hooks/campaigns'

export const CampaignEmailsTimeline = (props: {
    campaignId: string
    emails: CampaignEmailDTO[]
    organisationId: string
    showImproveButton?: boolean
}) => {
    const improveEmail = useCampaignEmailImprove()

    async function handleEmailImprove(
        email: CampaignEmailDTO,
        improvements: string
    ) {
        const result = await improveEmail.mutateAsync({
            body: { improvements },
            campaign: props.campaignId,
            email: email.id,
            organisation: props.organisationId,
        })

        email.sample = result.sample
    }

    return (
        <div>
            {props.emails.map((email, index) => {
                const isFirst = index === 0
                const isLast = index === props.emails.length - 1

                return (
                    <div
                        key={email.id}
                        className={cn('relative border-l-2 pl-4', {
                            'pb-4': !isLast,
                        })}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="bg-accent absolute top-5 -left-1.75 size-3 rounded-full" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                Day {email.day}
                            </TooltipContent>
                        </Tooltip>
                        {isFirst ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="absolute -top-1 -left-1.75 size-3 rounded-full bg-[#A29D99]" />
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    Campaign start
                                </TooltipContent>
                            </Tooltip>
                        ) : null}
                        {isLast ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="absolute -bottom-1 -left-1.75 size-3 rounded-full bg-[#A29D99]" />
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    Campaign end
                                </TooltipContent>
                            </Tooltip>
                        ) : null}

                        <Accordion
                            collapsible
                            defaultValue={index <= 0 ? 'content' : undefined}
                            type="single"
                        >
                            <AccordionItem value="content">
                                <Card className="overflow-hidden">
                                    <AccordionTrigger className="p-4">
                                        <CardHeader className="p-0">
                                            <Text variant="h4">
                                                Day {email.day}: {email.subject}
                                            </Text>
                                        </CardHeader>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <CardContent className="border-t p-0">
                                            <EmailPreviewer>
                                                <BasicEmail>
                                                    <EmailText className="whitespace-pre-wrap">
                                                        {email.sample}
                                                    </EmailText>
                                                </BasicEmail>
                                            </EmailPreviewer>
                                        </CardContent>
                                        {props.showImproveButton !== false && (
                                            <CardFooter className="p-4">
                                                <PopoverTextarea
                                                    className="h-32"
                                                    defaultValue=""
                                                    label="How would you like to improve this email?"
                                                    placeholder="Enter improvements"
                                                    onSave={(value) =>
                                                        handleEmailImprove(
                                                            email,
                                                            value
                                                        )
                                                    }
                                                >
                                                    <Button size="sm">
                                                        Improve
                                                    </Button>
                                                </PopoverTextarea>
                                            </CardFooter>
                                        )}
                                    </AccordionContent>
                                </Card>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )
            })}
        </div>
    )
}
