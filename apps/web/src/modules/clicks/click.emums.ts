export const ClickType = {
    CUSTOM: 'custom',
    EMAIL: 'email',
    SMS: 'sms',
    SYSTEM: 'system',
    QR: 'qr',
} as const
export type ClickType = typeof ClickType
export type ClickTypeKey = keyof ClickType
export type ClickTypeValue = ClickType[ClickTypeKey]
