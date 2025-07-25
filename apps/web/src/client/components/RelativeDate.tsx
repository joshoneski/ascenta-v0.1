'use client'

import { formatRelative } from 'date-fns'

export const RelativeDate = (props: { date: Date }) => {
    return capitaliseFirst(formatRelative(props.date, new Date()))
}

const capitaliseFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
