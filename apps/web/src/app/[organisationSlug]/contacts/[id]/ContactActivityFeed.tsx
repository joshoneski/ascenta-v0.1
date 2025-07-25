import { AutosizeIframe } from '@/client/components/AutosizeIframe'
import { Text } from '@/client/components/Text'
import { Button } from '@/client/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/client/components/ui/dialog'
import { cn } from '@/client/lib/utils'
import { CampaignEmailDeliveryStatus } from '@/modules/campaigns'
import { getPageAuth } from '@/server/auth/get-page-auth'
import { getContactActivityController } from '@/server/contacts/controllers/get-contact-activity.controller'
import { capitaliseFirstLetter } from '@/shared/string'
import { formatRelative } from 'date-fns'
import {
    AlertTriangleIcon,
    ClockIcon,
    MessageCircleQuestionIcon,
    SendIcon,
} from 'lucide-react'

export const ContactActivityFeed = async (props: { contactId: string }) => {
    const { buildUserRequestContext } = getPageAuth()
    const ctx = await buildUserRequestContext()

    const activity = await getContactActivityController(ctx, {
        contactId: props.contactId,
    })

    if (activity.data.length === 0) {
        return (
            <div className="bg-muted text-muted-foreground flex h-32 items-center justify-center rounded-sm">
                No activity to display
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activity.data.map((activity, index) => {
                const dateFormatted = formatRelative(
                    new Date(activity.data.statusUpdatedAt),
                    new Date()
                )

                return (
                    <div
                        key={activity.data.id}
                        className={cn(
                            'flex items-start justify-between gap-4',
                            {
                                'border-t pt-4': index !== 0,
                            }
                        )}
                    >
                        <div>
                            <div className="flex items-start gap-4">
                                <EmailDeliveryStatusIcon
                                    status={activity.data.status}
                                />

                                <div>
                                    <Text variant="h4">
                                        {activity.data.subject ? (
                                            activity.data.subject
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                Subject pending
                                            </span>
                                        )}
                                    </Text>
                                    <Text
                                        className="mt-1 text-gray-500"
                                        variant="bodyXs"
                                    >
                                        {capitaliseFirstLetter(
                                            activity.data.status
                                        )}{' '}
                                        {dateFormatted}
                                    </Text>

                                    {activity.data.status === 'failed' &&
                                    activity.data.error ? (
                                        <div className="bg-danger mt-4 w-full rounded-md px-4 py-2 text-white">
                                            <Text variant="bodyXs">
                                                {activity.data.error}
                                            </Text>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {activity.data.html ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary">
                                        View
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px]">
                                    <DialogHeader>
                                        <DialogTitle>Preview email</DialogTitle>
                                    </DialogHeader>

                                    <AutosizeIframe
                                        srcDoc={activity.data.html}
                                    />

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>

                                    <DialogCloseButton />
                                </DialogContent>
                            </Dialog>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

const EmailDeliveryStatusIcon = (props: {
    status: CampaignEmailDeliveryStatus | (string & {})
}) => {
    const status = props.status
    if (status === 'sent') {
        return (
            <div className="bg-success rounded-full p-2 text-white">
                <SendIcon className="size-5 stroke-1" />
            </div>
        )
    } else if (status === 'failed') {
        return (
            <div className="bg-danger rounded-full p-2 text-white">
                <AlertTriangleIcon className="size-5 stroke-1" />
            </div>
        )
    } else if (status === 'processing') {
        return (
            <div className="bg-warning rounded-full p-2 text-white">
                <ClockIcon className="size-5 stroke-1" />
            </div>
        )
    } else if (status === 'scheduled') {
        return (
            <div className="rounded-full bg-blue-500 p-2 text-white">
                <ClockIcon className="size-5 stroke-1" />
            </div>
        )
    } else {
        return (
            <div className="rounded-full bg-gray-200 p-2 text-white">
                <MessageCircleQuestionIcon className="size-5 stroke-1" />
            </div>
        )
    }
}
