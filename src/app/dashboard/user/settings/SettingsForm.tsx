"use client"

import { useToast } from "@/components/ui/Toast"
import { updateProfile } from "@/app/actions/user"
import { useState } from "react"

export function SettingsForm({ user }: { user: any }) {
    const { showToast } = useToast()
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        try {
            const result = await updateProfile(formData)
            if (result.error) {
                showToast(result.error, "error")
            } else {
                showToast("Pengaturan berhasil disimpan!", "success")
            }
        } catch (error) {
            showToast("Terjadi kesalahan", "error")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-[#121212] overflow-hidden relative group cursor-pointer">
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-bold">Ubah</span>
                    </div>
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-white font-bold mb-1">Foto Profil</h3>
                    <p className="text-gray-400 text-sm mb-3">Format: JPG, PNG. Maks 2MB.</p>
                    <button type="button" className="px-4 py-2 bg-[#252525] hover:bg-[#333] text-white rounded-lg text-sm font-medium transition-colors border border-gray-700">
                        Pilih File
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nama Tampilan</label>
                <input
                    name="name"
                    type="text"
                    className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    defaultValue={user.name || ""}
                    placeholder="Nama Lengkap"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                    name="username"
                    type="text"
                    className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    defaultValue={user.username || ""}
                    placeholder="username"
                />
                <p className="text-xs text-gray-500 mt-1">Username unik untuk profil Anda.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                    type="email"
                    className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary opacity-50 cursor-not-allowed"
                    defaultValue={user.email}
                    disabled
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                <textarea
                    name="bio"
                    className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-32 resize-none"
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    defaultValue={user.bio || ""}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Instagram</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500">@</span>
                        <input
                            name="instagram"
                            type="text"
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="username"
                            defaultValue={(user.socialLinks as any)?.instagram || ""}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Twitter / X</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500">@</span>
                        <input
                            name="twitter"
                            type="text"
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="username"
                            defaultValue={(user.socialLinks as any)?.twitter || ""}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 rounded-lg bg-primary text-black font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>
        </form>
    )
}
