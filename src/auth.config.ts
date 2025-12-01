import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server"

export const authConfig = {
    pages: {
        signIn: "/signin",
        verifyRequest: "/signin?verify=true",
    },
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                // When using database strategy, user is passed. 
                // When using JWT (if we were), token is passed.
                // With PrismaAdapter, it uses database strategy by default.
                if (token) {
                    (session.user as any).id = (token as any).id;
                    (session.user as any).name = (token as any).name;
                    (session.user as any).username = (token as any).username;
                    (session.user as any).email = (token as any).email;
                    (session.user as any).role = (token as any).role;
                    (session.user as any).avatar_url = (token as any).avatar_url;
                    (session.user as any).bio = (token as any).bio;
                    (session.user as any).status = (token as any).status
                }
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                (token as any).id = user.id;
                (token as any).name = (user as any).name;
                (token as any).username = (user as any).username;
                (token as any).role = (user as any).role;
                (token as any).email = (user as any).email;
                (token as any).avatar_url = (user as any).avatar_url;
                (token as any).bio = (user as any).bio;
                (token as any).status = (user as any).status
            }
            return token
        },
        authorized({ auth, request: nextUrl }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.nextUrl.pathname.startsWith("/dashboard")
            const isOnAuth = nextUrl.nextUrl.pathname.startsWith("/signin") || nextUrl.nextUrl.pathname.startsWith("/register")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            if (isOnAuth) {
                if (isLoggedIn) {
                    return NextResponse.redirect(new URL("/dashboard", nextUrl.nextUrl))
                }
                return true
            }

            return true
        },
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig
