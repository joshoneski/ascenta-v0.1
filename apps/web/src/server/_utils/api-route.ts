import { BadRequestError, ForbiddenError, NotFoundError } from '@/shared/errors'
import { ApiErrorResponse, ApiResponse } from '@/shared/types'
import { DrizzleError } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

type UniqueConstraintError = {
    code: '23505'
    constraint: string
    detail: string
    table: string
}

export function apiRoute<DTO, TContext = any>(
    route: (
        req: NextRequest,
        ctx: TContext
    ) => Promise<NextResponse<ApiResponse<DTO>>>
) {
    return async (
        req: NextRequest,
        ctx: TContext
    ): Promise<NextResponse<ApiResponse<DTO>>> => {
        try {
            return await route(req, ctx)
        } catch (e) {
            console.error(e)

            if (e instanceof BadRequestError) {
                return NextResponse.json(
                    {
                        error: {
                            code: 'bad_request',
                            message: e.message,
                        },
                    },
                    { status: 400 }
                )
            } else if (e instanceof ForbiddenError) {
                return NextResponse.json(
                    {
                        error: {
                            code: 'fobbiden',
                            message: e.message,
                        },
                    },
                    { status: 403 }
                )
            } else if (e instanceof NotFoundError) {
                return NextResponse.json(
                    {
                        error: {
                            code: 'not_found',
                            message: e.message,
                        },
                    },
                    { status: 404 }
                )
            }

            if (e instanceof DrizzleError) {
                return handleDrizzleError(e)
            }

            if (isUniqueConstraintError(e)) {
                return handleUniqueConstraintError(e)
            }

            // TODO: add correct status code
            return NextResponse.json(
                {
                    error: {
                        code: 'fatal',
                        message: 'A fatal error occurred.',
                    },
                },
                { status: 500 }
            )
        }
    }
}

function handleDrizzleError(e: DrizzleError): NextResponse<ApiErrorResponse> {
    const error = {
        code: 'database',
        message: 'Unexpected database error.',
    }

    return NextResponse.json({ error }, { status: 500 })
}

function handleUniqueConstraintError(
    e: UniqueConstraintError
): NextResponse<ApiErrorResponse> {
    const error = {
        code: 'database',
        message: 'Unexpected database error.',
    }

    if (e.constraint === 'organisations_slug_unique') {
        error.message = 'An organisation with that handle already exists.'
        return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ error }, { status: 500 })
}

function isUniqueConstraintError(
    error: unknown
): error is UniqueConstraintError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
    )
}
