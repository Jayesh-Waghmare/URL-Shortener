export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 10, // 10 minutes
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined
}