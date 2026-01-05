"use client" // Error components must be Client Components

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-yellow-500/30">
                <AlertTriangle className="text-yellow-500" size={40} />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">Ada yang salah!</h2>
            <div className="max-w-md">
                <p className="text-gray-400 mb-6">
                    Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba muat ulang atau kembali ke beranda.
                    {process.env.NODE_ENV === "development" && (
                        <span className="block mt-2 p-2 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs text-left font-mono overflow-auto">
                            Error: {error.message}
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
                    >
                        <RefreshCcw size={18} />
                        Coba Lagi
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#252525] border border-gray-700 text-white font-medium rounded-xl hover:bg-[#333] transition-colors"
                    >
                        <Home size={18} />
                        Ke Beranda
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-8 text-xs text-gray-600 font-mono">
                        Digest: {error.digest}
                    </p>
                )}
            </div>
        </div>
    )
}
