import { enrichContactTask } from '@/modules/background-tasks/application/tasks/enrich-contact.task'
import { scheduleCampaignEmailsTask } from '@/modules/campaigns/application/tasks/schedule-campaign-emails.task'
import { sendScheduledCampaignEmailTask } from '@/modules/campaigns/application/tasks/send-scheduled-campaign-email.task'

export const inngestFunctions = [
    enrichContactTask,
    scheduleCampaignEmailsTask,
    sendScheduledCampaignEmailTask,
]
