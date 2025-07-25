/**
 * Similar solutions https://stackoverflow.com/a/1855903
 * @param hex
 */
export const hexContrastMode = (hex: string) => {
    const hexCode = hex.charAt(0) === '#' ? hex.substring(1, 6) : hex

    const hexR = parseInt(hexCode.substring(0, 2), 16)
    const hexG = parseInt(hexCode.substring(2, 4), 16)
    const hexB = parseInt(hexCode.substring(4, 6), 16)

    // Gets the average value of the colors
    const contrastRatio = (hexR + hexG + hexB) / (255 * 3)

    return contrastRatio > 0.5 ? 'light' : 'dark'
}

/**
 * Similar solutions https://stackoverflow.com/a/1855903
 * @param hex
 */
export const hexForegroundColour = (hex: string) => {
    const contrastMode = hexContrastMode(hex)
    if (contrastMode === 'light') {
        return '#333333'
    } else if (contrastMode === 'dark') {
        return '#FFFFFF'
    }
}
