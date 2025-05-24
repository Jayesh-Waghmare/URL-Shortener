import { generateNanoId } from "../utils/helper.js"
import urlSchema from "../models/short_url.model.js"
import { getCustomShortUrl, saveShortUrl } from "../dao/short_url.js"

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = generateNanoId(7)
    if(!shortUrl) throw new Error("Short URL not generated")
    await saveShortUrl(shortUrl, url)
    return shortUrl
}

export const createShortUrlWithUser = async (url, userId, slug = null) => {
    try {
        // If no custom slug is provided, generate a random one
        const shortUrl = slug || generateNanoId(7)
        
        // If a custom slug is provided, check if it already exists
        if (slug) {
            const exists = await getCustomShortUrl(slug)
            if (exists) {
                throw new Error("This custom url already exists")
            }
            
            // Validate slug format
            if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
                throw new Error("Custom slug can only contain letters, numbers, hyphens, and underscores")
            }
            
            // Check slug length
            if (slug.length < 3 || slug.length > 30) {
                throw new Error("Custom slug must be between 3 and 30 characters")
            }
        }

        await saveShortUrl(shortUrl, url, userId)
        return shortUrl
    } catch (error) {
        if (error.message === "This custom url already exists") {
            throw error
        }
        throw new Error(`Error creating short URL: ${error.message}`)
    }
}