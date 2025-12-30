"use client"

import { useState, useRef, useEffect } from "react"
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { checkUserExists } from "@/app/actions/auth"
import { initiateRegistration, verifyOTP, resendOTP } from "@/app/actions/registration"
import { useToast } from "@/components/ui/Toast"
import { useRouter } from "next/navigation"

type AuthState = "landing" | "signin" | "signup" | "otp" | "verify"

export default function AuthCard() {
    const [authState, setAuthState] = useState<AuthState>("landing")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""])
    const [resendTimer, setResendTimer] = useState(0)
    const [callbackUrl, setCallbackUrl] = useState<string | undefined>(undefined)
    const { showToast } = useToast()
    const router = useRouter()
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Get callback URL from query params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const callback = params.get("callbackUrl")
        if (callback) {
            setCallbackUrl(callback)
        }
    }, [])

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer])

    const handleBack = () => {
        if (authState === "otp") {
            setAuthState("signup")
            setOtpValues(["", "", "", "", "", ""])
        } else if (authState === "verify") {
            setAuthState("landing")
        } else {
            setAuthState("landing")
        }
        setError("")
    }

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleSignIn = async () => {
        setError("")
        if (!validateEmail(email)) {
            setError("Format email tidak valid")
            return
        }

        setIsLoading(true)
        try {
            // 1. Check if user exists
            const exists = await checkUserExists(email)
            if (!exists) {
                setError("Akun tidak ditemukan. Silakan daftar terlebih dahulu.")
                setIsLoading(false)
                return
            }

            // 2. Send Magic Link
            const result = await signIn("nodemailer", {
                email,
                redirect: false,
                callbackUrl: callbackUrl || "/dashboard",
            })

            if (result?.error) {
                showToast("Gagal mengirim email login.", "error")
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

    const handleSignUp = async () => {
        setError("")
        if (!validateEmail(email)) {
            setError("Format email tidak valid")
            return
        }

        setIsLoading(true)
        try {
            const result = await initiateRegistration(email, callbackUrl)

            if (result.error) {
                if (result.error === "profile_incomplete") {
                    // User exists but hasn't completed profile
                    showToast("Silakan lengkapi profil Anda.", "info")
                    router.push(`/complete-profile?callbackUrl=${encodeURIComponent(callbackUrl || "/dashboard")}`)
                } else {
                    setError(result.error)
                }
                setIsLoading(false)
                return
            }

            // Success - move to OTP input
            setAuthState("otp")
            setResendTimer(60)
            showToast("Kode OTP telah dikirim ke email Anda.", "success")
        } catch (err) {
            console.error(err)
            showToast("Terjadi kesalahan.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOTPChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d+$/.test(value)) return

        const newOtpValues = [...otpValues]

        // Handle paste - if pasting a full OTP
        if (value.length > 1) {
            const digits = value.slice(0, 6).split("")
            digits.forEach((digit, i) => {
                if (i < 6) newOtpValues[i] = digit
            })
            setOtpValues(newOtpValues)
            // Focus last filled input or the 6th input
            const lastIndex = Math.min(digits.length - 1, 5)
            otpInputRefs.current[lastIndex]?.focus()
            return
        }

        newOtpValues[index] = value
        setOtpValues(newOtpValues)

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus()
        }
    }

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerifyOTP = async () => {
        const otp = otpValues.join("")
        if (otp.length !== 6) {
            setError("Masukkan 6 digit kode OTP")
            return
        }

        setError("")
        setIsLoading(true)
        try {
            const result = await verifyOTP(email, otp)

            if (result.error) {
                setError(result.error)
                setIsLoading(false)
                return
            }

            // Success - redirect to complete profile
            showToast("Email berhasil diverifikasi!", "success")
            const redirectUrl = result.callbackUrl || callbackUrl || "/dashboard"
            router.push(`/complete-profile?callbackUrl=${encodeURIComponent(redirectUrl)}`)
        } catch (err) {
            console.error(err)
            showToast("Terjadi kesalahan.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (resendTimer > 0) return

        setIsLoading(true)
        try {
            const result = await resendOTP(email)

            if (result.error) {
                showToast(result.error, "error")
                return
            }

            showToast("Kode OTP baru telah dikirim.", "success")
            setResendTimer(60)
            setOtpValues(["", "", "", "", "", ""])
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
                    <h2 className="text-2xl font-bold text-white">Masuk</h2>

                    <div className="space-y-4">
                        <button
                            onClick={() => setAuthState("signup")}
                            className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors"
                        >
                            Buat akun
                        </button>

                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <div className="h-px bg-gray-700 flex-1" />
                            <span>atau</span>
                            <div className="h-px bg-gray-700 flex-1" />
                        </div>

                        <button
                            onClick={() => setAuthState("signin")}
                            className="w-full bg-gray-300 text-black font-bold py-3 rounded-full hover:bg-white transition-colors"
                        >
                            Masuk ke akun yang ada
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-tight">
                        Dengan masuk, Anda menyetujui Syarat Penggunaan dan Pemberitahuan Privasi DBFPN.
                    </p>
                </div>
            )}

            {authState === "signin" && (
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Masuk</h2>

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
                                    placeholder="your@email.com"
                                    className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs text-left ml-1">{error}</p>}

                        <button
                            onClick={handleSignIn}
                            disabled={isLoading}
                            className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Memproses..." : "Lanjutkan"}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <div className="h-px bg-gray-700 flex-1" />
                            <span>atau</span>
                            <div className="h-px bg-gray-700 flex-1" />
                        </div>

                        <button className="w-full bg-gray-300 text-black font-bold py-3 rounded-full hover:bg-white transition-colors">
                            Masuk dengan Google
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-tight">
                        Dengan masuk, Anda menyetujui Syarat Penggunaan dan Pemberitahuan Privasi DBFPN.
                    </p>
                </div>
            )}

            {authState === "signup" && (
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Buat Akun</h2>

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
                                    placeholder="your@email.com"
                                    className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs text-left ml-1">{error}</p>}

                        <button
                            onClick={handleSignUp}
                            disabled={isLoading}
                            className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Memproses..." : "Lanjutkan"}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <div className="h-px bg-gray-700 flex-1" />
                            <span>atau</span>
                            <div className="h-px bg-gray-700 flex-1" />
                        </div>

                        <button className="w-full bg-gray-300 text-black font-bold py-3 rounded-full hover:bg-white transition-colors">
                            Daftar dengan Google
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-tight">
                        Dengan melanjutkan, Anda menyetujui Syarat Penggunaan dan Pemberitahuan Privasi DBFPN.
                    </p>
                </div>
            )}

            {authState === "otp" && (
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Verifikasi Email</h2>
                    <p className="text-gray-400 text-sm">
                        Masukkan kode 6 digit yang telah dikirim ke <strong className="text-white">{email}</strong>
                    </p>

                    <div className="space-y-4">
                        {/* OTP Input */}
                        <div className="flex justify-center gap-2">
                            {otpValues.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { otpInputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={value}
                                    onChange={(e) => handleOTPChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                    className={`w-12 h-14 text-center text-xl font-bold bg-[#333] border rounded-lg text-white focus:outline-none transition-colors ${error ? "border-red-500" : "border-gray-700 focus:border-primary"
                                        }`}
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}

                        <button
                            onClick={handleVerifyOTP}
                            disabled={isLoading || otpValues.join("").length !== 6}
                            className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Memverifikasi..." : "Verifikasi"}
                        </button>

                        {/* Resend OTP */}
                        <div className="text-sm text-gray-400">
                            {resendTimer > 0 ? (
                                <span>Kirim ulang kode dalam {resendTimer} detik</span>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="text-primary hover:underline disabled:opacity-50"
                                >
                                    Kirim ulang kode
                                </button>
                            )}
                        </div>
                    </div>
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
                        Kami telah mengirimkan tautan login ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-[#333] rounded-lg border border-gray-700 text-xs text-gray-400 text-left">
                            <p className="mb-2"><strong>Tips:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Klik tautan di email untuk masuk secara otomatis.</li>
                                <li>Tautan hanya berlaku untuk satu kali penggunaan.</li>
                                <li>Jika tidak menerima email, periksa folder Spam.</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setAuthState("landing")}
                            className="w-full bg-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-600 transition-colors mt-4"
                        >
                            Kembali ke Awal
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
