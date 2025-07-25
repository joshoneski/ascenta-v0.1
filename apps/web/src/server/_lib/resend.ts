import { backendConfig } from '@/server/backend-config'
import { Resend } from 'resend'

export const resend = new Resend(backendConfig.RESEND_API_KEY)
