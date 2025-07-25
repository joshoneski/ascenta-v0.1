// Taken from https://github.com/orgs/react-hook-form/discussions/1991#discussioncomment-7752067
export const getDirtyValues = <
    TData extends Record<keyof TDirtyFields, unknown>,
    TDirtyFields extends Record<string, unknown>,
>(
    values: TData,
    dirtyFields: TDirtyFields
): Partial<TData> => {
    const dirtyFieldsEntries = Object.entries(dirtyFields)

    return dirtyFieldsEntries.reduce((dirtyData, [name, value]) => {
        if (typeof value !== 'object') {
            return { ...dirtyData, [name]: values[name] }
        }

        return {
            ...dirtyData,
            [name]: getDirtyValues(
                values[name] as TData,
                dirtyFields[name] as TDirtyFields
            ),
        }
    }, {})
}
