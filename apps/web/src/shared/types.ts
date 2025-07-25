export * from './dtos/organisation.dto'
export * from './dtos/user.dto'

export type EnumOrAnyString<TEnum extends string> = TEnum | (string & {})

export type ApiSuccessResponse<ResponseObject> = ResponseObject
export type ApiErrorResponse = { error: { code?: string; message: string } }

export type ApiResponse<ResponseObject> =
    | ApiSuccessResponse<ResponseObject>
    | ApiErrorResponse
