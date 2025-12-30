"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, AtSign } from "lucide-react"
import { useToast } from "@/components/ui/Toast"

interface CompleteProfileFormProps {
    callbackUrl: string
    initialData: {
        name: string
        username: string
    }
}

export default function CompleteProfileForm({ callbackUrl, initialData }: CompleteProfileFormProps) {
    const [name, setName] = useState(initialData.name)
    const [username, setUsername] = useState(initialData.username)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; username?: string }>({})
    const { showToast } = useToast()
    const router = useRouter()

    const validateUsername = (value: string) => {
        // Username: alphanumeric and underscores only, 3-20 characters
        const re = /^[a-zA-Z0-9_]{3,20}$/
        return re.test(value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate
        const newErrors: { name?: string; username?: string } = {}

        if (!name.trim()) {
            newErrors.name = "Nama wajib diisi"
        } else if (name.trim().length < 2) {
            newErrors.name = "Nama minimal 2 karakter"
        }

        if (!username.trim()) {
            newErrors.username = "Username wajib diisi"
        } else if (!validateUsername(username)) {
            newErrors.username = "Username hanya boleh huruf, angka, dan underscore (3-20 karakter)"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("name", name.trim())
            formData.append("username", username.trim().toLowerCase())
            formData.append("bio", "")
            formData.append("instagram", "")
            formData.append("twitter", "")

            const response = await fetch("/api/complete-profile", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (result.error) {
                if (result.error === "Username already taken") {
                    setErrors({ username: "Username sudah digunakan" })
                } else {
                    showToast(result.error, "error")
                }
                return
            }

            showToast("Profil berhasil disimpan!", "success")
            router.push(callbackUrl)
        } catch (error) {
            console.error(error)
            showToast("Terjadi kesalahan", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
                <div className={`bg-[#333] rounded-lg p-3 flex items-center gap-3 border transition-colors ${errors.name ? "border-red-500" : "border-gray-700 focus-within:border-primary"
                    }`}>
                    <User className="text-gray-400" size={24} />
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Nama Lengkap</div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (errors.name) setErrors({ ...errors, name: undefined })
                            }}
                            placeholder="Nama Lengkap Anda"
                            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                        />
                    </div>
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            {/* Username Field */}
            <div>
                <div className={`bg-[#333] rounded-lg p-3 flex items-center gap-3 border transition-colors ${errors.username ? "border-red-500" : "border-gray-700 focus-within:border-primary"
                    }`}>
                    <AtSign className="text-gray-400" size={24} />
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Username</div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value.toLowerCase())
                                if (errors.username) setErrors({ ...errors, username: undefined })
                            }}
                            placeholder="username_anda"
                            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                        />
                    </div>
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                <p className="text-xs text-gray-500 mt-1 ml-1">
                    Username akan digunakan untuk profil publik Anda
                </p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Menyimpan..." : "Selesaikan Pendaftaran"}
            </button>
        </form>
    )
}
