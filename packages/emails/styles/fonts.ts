const fallbackFonts = [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    '"Helvetica Neue"',
    '"Helvetica"',
    'BlinkMacSystemFont',
    'Arial',
    '"Segoe UI"',
    'Roboto',
    '"Noto Sans"',
    'sans-serif',
].join(', ')

export const heading = {
    fontFamily: `"Catamaran", ${fallbackFonts}`,
    fontWeight: 600,
}
export const body = {
    fontFamily: `"Open Sans", ${fallbackFonts}`,
}
