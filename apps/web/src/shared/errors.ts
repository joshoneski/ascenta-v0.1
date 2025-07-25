export class BadRequestError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class FatalError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class MissingOrganisationHeaderError extends Error {
    constructor() {
        super('Organisation header is missing.')
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class UnauthorisedError extends Error {
    constructor() {
        super('Unauthorised')
    }
}
