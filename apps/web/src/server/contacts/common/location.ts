export function formatLocation(
    city: string | null,
    region: string | null,
    country: string | null
) {
    const locationParts: string[] = []
    if (city) {
        locationParts.push(city)
    }
    if (region) {
        locationParts.push(region)
    }
    if (country) {
        locationParts.push(country)
    }

    if (locationParts.length === 0) {
        return null
    }
    return locationParts.join(', ')
}
