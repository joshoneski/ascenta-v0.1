import { apiRoute } from '@/server/_utils/api-route'
import { getApiAuth } from '@/server/auth/get-api-auth'
import { importContactsController } from '@/server/contacts/controllers/import-contacts.controller'
import { ContactImportResponse } from '@ascenta-plus/types'
import { parse } from 'csv-parse'
import { NextResponse } from 'next/server'
import { zfd } from 'zod-form-data'

const schema = zfd.formData({
    file: zfd.file(),
})

export const POST = apiRoute<ContactImportResponse>(async (req) => {
    const {
        buildUserRequestContext,
        getUserOrThrow,
        getOrganisationIdOrThrow,
    } = getApiAuth()
    const reqCtx = await buildUserRequestContext()
    const user = await getUserOrThrow()
    const organisationId = await getOrganisationIdOrThrow()

    const unsafeFormData = await req.formData()
    const formData = schema.parse(unsafeFormData)

    const file = formData.file
    const content = await file.text()
    const rows = await readCsv(content)

    const result = await importContactsController(
        reqCtx,
        rows,
        organisationId,
        user
    )

    return NextResponse.json({
        created: result.createdCount,
        updated: result.updatedCount,
    })
})

async function readCsv(content: string): Promise<string[][]> {
    const lines: string[][] = []

    return new Promise((resolve, reject) => {
        parse(content, { delimiter: ',', from_line: 1 })
            .on('data', function (row: string[]) {
                lines.push(row)
            })
            .on('end', function () {
                resolve(lines)
            })
            .on('error', function (error) {
                reject(error)
            })
    })
}
