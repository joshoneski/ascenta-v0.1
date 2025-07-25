// Better Auth API routes disabled temporarily due to "hex string expected" errors
// import { auth } from '@/server/auth'
// import { toNextJsHandler } from 'better-auth/next-js'

// export const { POST, GET } = toNextJsHandler(auth)

// Temporary disabled endpoints - return 501 Not Implemented
export async function POST() {
    return new Response('Authentication temporarily disabled for development', {
        status: 501,
        statusText: 'Not Implemented'
    })
}

export async function GET() {
    return new Response('Authentication temporarily disabled for development', {
        status: 501,
        statusText: 'Not Implemented'
    })
}
