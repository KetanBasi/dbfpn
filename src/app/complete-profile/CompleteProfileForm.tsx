"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "lucide-react"
import { useToast } from "@/components/ui/Toast"

export default function CompleteProfileForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { showToast } = useToast()

    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const trimmedUsername = username.trim().toLowerCase()
        const trimmedName = name.trim()

        if (!trimmedUsername) {
            setError("Username wajib diisi")
            return
        }

        if (trimmedUsername.length < 3) {
            setError("Username minimal 3 karakter")
            return
        }

        if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
            setError("Username hanya boleh huruf kecil, angka, dan underscore")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/user/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: trimmedUsername,
                    name: trimmedName || null
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Gagal menyimpan profil")
                return
            }

            showToast("Profil berhasil disimpan!", "success")

            // Force refresh session and redirect
            router.push(callbackUrl)
            router.refresh()
        } catch {
            setError("Terjadi kesalahan jaringan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="text-primary" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Lengkapi Profil</h1>
                        <p className="text-gray-400 mt-2">Pilih username untuk akun kamu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    placeholder="username"
                                    disabled={loading}
                                    className="w-full bg-[#252525] border border-gray-700 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary disabled:opacity-50"
                                />
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                                Huruf kecil, angka, underscore. Min 3 karakter.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nama Tampilan <span className="text-gray-500">(opsional)</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama lengkap atau panggilan"
                                disabled={loading}
                                className="w-full bg-[#252525] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary disabled:opacity-50"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !username.trim()}
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
