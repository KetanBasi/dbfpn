"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UpgradeButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleUpgrade = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()

            if (data.success) {
                // Refresh the page to show updated status
                router.refresh()
            } else {
                alert(data.error || "Gagal mengaktifkan Verified")
            }
        } catch (error) {
            console.error("Upgrade error:", error)
            alert("Terjadi kesalahan")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
            <Sparkles size={18} className="group-hover:animate-pulse" />
            {isLoading ? "Mengaktifkan..." : "Aktifkan Verified"}
        </button>
    )
}
