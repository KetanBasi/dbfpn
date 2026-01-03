"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

export default function AccountDisabledPage() {
    useEffect(() => {
        // Automatically sign out and redirect to signin with error
        signOut({ callbackUrl: "/signin?error=AccountDisabled" })
    }, [])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">Sedang keluar...</p>
            </div>
        </div>
    )
}
