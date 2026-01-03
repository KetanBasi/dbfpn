"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthSessionProvider
            // Reduce session API calls for better performance
            refetchInterval={5 * 60} // Refetch every 5 minutes (in seconds)
            refetchOnWindowFocus={false} // Don't refetch on tab focus
        >
            {children}
        </NextAuthSessionProvider>
    )
}
