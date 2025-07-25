// Taken from https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n
export function slugify(slug: string) {
    return slug
        .replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
        .toLowerCase() // convert string to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
}

export function isSlug(slug: string) {
    return slug === slugify(slug)
}
