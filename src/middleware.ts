import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(request: NextRequest) {
    const session = await auth()
    const path = request.nextUrl.pathname

    // Skip these paths from middleware processing
    const skipPaths = [
        "/complete-profile",
        "/signin",
        "/account-disabled",
        "/api",
        "/_next",
        "/favicon.ico",
    ]

    if (skipPaths.some(p => path.startsWith(p))) {
        return NextResponse.next()
    }

    // If user is logged in, check their status and profile completion
    if (session?.user) {
        const userStatus = (session.user as any).status
        const username = (session.user as any).username

        // Check if user is banned or inactive - redirect to auto-signout page
        if (userStatus === "banned" || userStatus === "inactive") {
            const disabledUrl = new URL("/account-disabled", request.url)
            return NextResponse.redirect(disabledUrl)
        }

        // If user has no username, redirect to complete profile
        if (!username && path !== "/complete-profile") {
            const url = new URL("/complete-profile", request.url)
            url.searchParams.set("callbackUrl", path)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
