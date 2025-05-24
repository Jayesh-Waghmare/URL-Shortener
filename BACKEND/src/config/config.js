export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined
}