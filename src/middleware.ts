import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(request: NextRequest) {
    const session = await auth()
    const path = request.nextUrl.pathname

    // Skip profile completion check for these paths
    const skipPaths = [
        "/complete-profile",
        "/signin",
        "/api",
        "/_next",
        "/favicon.ico",
    ]

    if (skipPaths.some(p => path.startsWith(p))) {
        return NextResponse.next()
    }

    // If user is logged in but has no username, redirect to complete profile
    if (session?.user) {
        const username = (session.user as any).username

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
