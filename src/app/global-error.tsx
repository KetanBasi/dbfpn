"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-black text-white min-h-screen flex items-center justify-center p-4`}>
                <div className="text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-yellow-500/30">
                        <AlertTriangle className="text-yellow-500" size={48} />
                    </div>

                    <h1 className="text-4xl font-bold mb-4">Critical Error</h1>
                    <p className="text-gray-400 mb-8">
                        Terjadi kesalahan fatal pada aplikasi.
                        {error.digest && (
                            <span className="block mt-2 text-xs font-mono text-gray-600">Digest: {error.digest}</span>
                        )}
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors text-lg"
                        >
                            <RefreshCcw size={20} />
                            Coba Lagi
                        </button>

                        <button
                            onClick={() => window.location.href = "/"}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-[#252525] border border-gray-700 text-white font-medium rounded-xl hover:bg-[#333] transition-colors"
                        >
                            <Home size={20} />
                            Muat Ulang Aplikasi
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
