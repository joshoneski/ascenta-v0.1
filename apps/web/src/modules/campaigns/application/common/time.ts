export function daysToMilliseconds(days: number) {
    return days * 24 * 60 * 60 * 1000
}

export function millisecondsToDays(ms: number) {
    return Math.round(ms / 24 / 60 / 60 / 1000)
}
