import { NextRequest, NextResponse } from 'next/server'
import { X_URL_PATHNAME_HEADER } from './shared/constants'

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(X_URL_PATHNAME_HEADER, request.nextUrl.pathname)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}
