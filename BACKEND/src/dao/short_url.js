import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    try {
        // Ensure the URL has http/https prefix
        let fullUrl = longUrl;
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = 'https://' + fullUrl;
        }

        const newUrl = new urlSchema({
            full_url: fullUrl,
            short_url: shortUrl
        })
        if(userId){
            newUrl.user = userId
        }
        await newUrl.save()
    } catch(err) {
        if(err.code == 11000){
            throw new ConflictError("Short URL already exists")
        }
        throw new Error(err)
    }
};

export const getShortUrl = async (shortUrl) => {
    try {
        const url = await urlSchema.findOneAndUpdate(
            { short_url: shortUrl },
            { $inc: { clicks: 1 } },
            { new: true }
        );
        return url;
    } catch (error) {
        console.error('Error finding short URL:', error);
        throw error;
    }
}

export const getCustomShortUrl = async (slug) => {
    try {
        return await urlSchema.findOne({ short_url: slug });
    } catch (error) {
        console.error('Error finding custom short URL:', error);
        throw error;
    }
}