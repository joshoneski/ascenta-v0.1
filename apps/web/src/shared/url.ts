export function getUrlPathnameParts(pathname: string) {
    return pathname.replace(/^\/|\/$/g, '').split('/')
}
