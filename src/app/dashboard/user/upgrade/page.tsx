import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BadgeCheck, Sparkles, Crown, Building2, Check, X, Zap, FileBarChart, Download, Film } from "lucide-react"
import UpgradeButton from "@/components/dashboard/UpgradeButton"

export default async function UpgradePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/signin")
    }

    const userId = Number((session.user as any).id)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerified: true, role: true }
    })

    const isVerified = user?.isVerified || user?.role === "admin"

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Upgrade Akun</h1>
                <p className="text-gray-400">Tingkatkan akunmu untuk mendapatkan fitur premium</p>
            </div>

            {/* Demo Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
                <Zap className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="text-yellow-500 font-bold text-sm">Demo Mode</p>
                    <p className="text-yellow-500/80 text-sm">
                        Dalam mode demo ini, memilih paket Verified akan mengaktifkan status terverifikasi tanpa pembayaran nyata.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-gray-700/50">
                                <Crown size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Gratis</h3>
                        </div>
                        <p className="text-gray-400 text-sm">Untuk pengguna umum</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">Rp 0</span>
                            <span className="text-gray-500 text-sm">/selamanya</span>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Lihat & nilai film
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Tulis komentar
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Simpan watchlist
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-500">
                            <X size={16} className="text-gray-600" /> Kirim film baru
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-500">
                            <X size={16} className="text-gray-600" /> Laporan performa akun
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-500">
                            <X size={16} className="text-gray-600" /> Unduh laporan tren genre
                        </li>
                    </ul>

                    <button
                        disabled
                        className="w-full py-3 rounded-lg bg-gray-800 text-gray-500 font-bold cursor-not-allowed"
                    >
                        Paket Saat Ini
                    </button>
                </div>

                {/* Verified Plan */}
                <div className="bg-gradient-to-b from-blue-500/10 to-[#1a1a1a] rounded-2xl border-2 border-blue-500/50 p-6 flex flex-col relative overflow-hidden">
                    {/* Popular badge */}
                    <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 rounded-full bg-blue-500 text-xs font-bold text-white">
                            POPULER
                        </span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <BadgeCheck size={20} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Verified</h3>
                        </div>
                        <p className="text-gray-400 text-sm">Untuk kontributor aktif</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">Rp 49.000</span>
                            <span className="text-gray-500 text-sm">/bulan</span>
                        </div>
                        <p className="text-blue-400 text-xs mt-1">* Gratis di mode demo</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Semua fitur Gratis
                        </li>
                        <li className="flex items-center gap-2 text-sm text-white font-medium">
                            <Film size={16} className="text-blue-400" /> Kirim film baru
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <FileBarChart size={16} className="text-blue-400" /> Laporan performa akun
                            <span className="text-xs text-gray-500">(segera)</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Download size={16} className="text-blue-400" /> Unduh laporan tren genre
                            <span className="text-xs text-gray-500">(segera)</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm text-blue-400">
                            <BadgeCheck size={16} /> Badge Verified
                        </li>
                    </ul>

                    {isVerified ? (
                        <div className="w-full py-3 rounded-lg bg-green-500/20 text-green-500 font-bold text-center border border-green-500/30 flex items-center justify-center gap-2">
                            <BadgeCheck size={18} /> Sudah Terverifikasi
                        </div>
                    ) : (
                        <UpgradeButton />
                    )}
                </div>

                {/* Partnership Plan */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Building2 size={20} className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Partnerships</h3>
                        </div>
                        <p className="text-gray-400 text-sm">Untuk bisnis & sponsor</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">Custom</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">Sesuai kebutuhan</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Semua fitur Verified
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Branding & sponsorship
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> API akses khusus
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Dedicated support
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-green-500" /> Custom integrasi
                        </li>
                    </ul>

                    <a
                        href="mailto:partnerships@dbfpn.com"
                        className="w-full py-3 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-center hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </>
    )
}
