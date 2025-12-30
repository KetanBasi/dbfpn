"use client"

import { useState, useEffect } from "react"
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { useToast } from "@/components/ui/Toast"

type AuthState = "landing" | "email" | "verify"

export default function AuthCard() {
    const [authState, setAuthState] = useState<AuthState>("landing")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [callbackUrl, setCallbackUrl] = useState<string | undefined>(undefined)
    const { showToast } = useToast()

    // Get callback URL from query params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const callback = params.get("callbackUrl")
        if (callback) {
            setCallbackUrl(callback)
        }
    }, [])

    const handleBack = () => {
        setAuthState("landing")
        setError("")
    }

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleEmailSignIn = async () => {
        setError("")
        if (!validateEmail(email)) {
            setError("Format email tidak valid")
            return
        }

        setIsLoading(true)
        try {
            // NextAuth magic link handles both login and registration
            // If user doesn't exist, they'll be created automatically
            const result = await signIn("nodemailer", {
                email,
                redirect: false,
                callbackUrl: callbackUrl || "/dashboard",
            })

            if (result?.error) {
                showToast("Gagal mengirim email.", "error")
            } else {
                setAuthState("verify")
            }
        } catch (err) {
            console.error(err)
            showToast("Terjadi kesalahan.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-[#252525] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800 relative min-h-[400px] flex flex-col justify-center">
            {authState !== "landing" && authState !== "verify" && (
                <button
                    onClick={handleBack}
                    className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            )}

            {authState === "landing" && (
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Selamat Datang</h2>
                    <p className="text-gray-400 text-sm">
                        Masuk atau daftar dengan email
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => setAuthState("email")}
                            className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Mail size={20} />
                            Lanjutkan dengan Email
                        </button>

                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <div className="h-px bg-gray-700 flex-1" />
                            <span>atau</span>
                            <div className="h-px bg-gray-700 flex-1" />
                        </div>

                        <button
                            className="w-full bg-gray-300 text-black font-bold py-3 rounded-full hover:bg-white transition-colors opacity-50 cursor-not-allowed"
                            disabled
                        >
                            Lanjutkan dengan Google (Segera)
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-tight">
                        Dengan masuk, Anda menyetujui Syarat Penggunaan dan Pemberitahuan Privasi DBFPN.
                    </p>
                </div>
            )}

            {authState === "email" && (
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Masukkan Email</h2>
                    <p className="text-gray-400 text-sm">
                        Kami akan mengirim tautan untuk masuk
                    </p>

                    <div className="space-y-4">
                        <div className={`bg-[#333] rounded-lg p-3 flex items-center gap-3 border transition-colors text-left ${error ? "border-red-500" : "border-gray-700 focus-within:border-primary"}`}>
                            <Mail className="text-gray-400" size={24} />
                            <div className="flex-1">
                                <div className="text-[10px] text-gray-400 uppercase font-bold">Email</div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (error) setError("")
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
                                    placeholder="your@email.com"
                                    autoFocus
                                    className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs text-left ml-1">{error}</p>}

                        <button
                            onClick={handleEmailSignIn}
                            disabled={isLoading}
                            className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Mengirim..." : "Lanjutkan"}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-tight">
                        Jika email belum terdaftar, akun baru akan dibuat secara otomatis.
                    </p>
                </div>
            )}

            {authState === "verify" && (
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                            <CheckCircle size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Periksa Email Anda</h2>

                    <p className="text-gray-400 text-sm">
                        Kami telah mengirimkan tautan login ke <strong className="text-white">{email}</strong>
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-[#333] rounded-lg border border-gray-700 text-xs text-gray-400 text-left">
                            <p className="mb-2"><strong>Tips:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Klik tautan di email untuk masuk secara otomatis</li>
                                <li>Tautan hanya berlaku untuk satu kali penggunaan</li>
                                <li>Jika tidak menerima email, periksa folder Spam</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => {
                                setAuthState("landing")
                                setEmail("")
                            }}
                            className="w-full bg-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-600 transition-colors mt-4"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
