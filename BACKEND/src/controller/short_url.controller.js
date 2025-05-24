import { getShortUrl } from "../dao/short_url.js"
import { createShortUrlWithoutUser, createShortUrlWithUser } from "../services/short_url.service.js"
import wrapAsync from "../utils/tryCatchWrapper.js"

export const createShortUrl = wrapAsync(async (req,res)=>{
    const data = req.body
    let shortUrl
    if(req.user){
        shortUrl = await createShortUrlWithUser(data.url,req.user._id,data.slug)
    }else{  
        shortUrl = await createShortUrlWithoutUser(data.url)
    }
    res.status(200).json({shortUrl : process.env.APP_URL + shortUrl})
})

export const redirectFromShortUrl = wrapAsync(async (req,res)=>{
    const {id} = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Short URL ID is required" });
    }

    try {
        const url = await getShortUrl(id)
        if(!url) {
            return res.status(404).json({ success: false, message: "Short URL not found" });
        }

        // Ensure the URL has http/https prefix
        let redirectUrl = url.full_url;
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
            redirectUrl = 'https://' + redirectUrl;
        }

        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).json({ success: false, message: "Error processing redirect" });
    }
})

export const createCustomShortUrl = wrapAsync(async (req,res)=>{
    const {url, slug} = req.body
    if (!url) {
        return res.status(400).json({ success: false, message: "URL is required" });
    }
    if (!slug) {
        return res.status(400).json({ success: false, message: "Custom slug is required" });
    }

    try {
        const shortUrl = await createShortUrlWithUser(url, req.user?._id, slug)
        res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl })
    } catch (error) {
        if (error.message === "This custom url already exists") {
            return res.status(409).json({ success: false, message: error.message });
        }
        throw error;
    }
})