import Link from "next/link"
import { Settings as SettingsIcon, Globe, Lock, Database } from "lucide-react"

export default function AdminSettings() {
    return (
        <>
            <h1 className="text-3xl font-bold text-white mb-8">Pengaturan Platform</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Globe size={24} /></div>
                        <h2 className="text-xl font-bold text-white">Umum</h2>
                    </div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Nama Situs</label>
                            <input type="text" className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="DBFPN" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Deskripsi</label>
                            <textarea className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary h-24" defaultValue="Database Film Terlengkap" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-gray-400 text-sm">Mode Pemeliharaan</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Security & System */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><Lock size={24} /></div>
                        <h2 className="text-xl font-bold text-white">Keamanan & Sistem</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-[#252525] rounded-lg border border-gray-700 flex justify-between items-center">
                            <div>
                                <div className="text-white font-medium">Pendaftaran Pengguna</div>
                                <div className="text-xs text-gray-500">Izinkan pengguna baru mendaftar</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="p-4 bg-[#252525] rounded-lg border border-gray-700">
                            <div className="flex items-center gap-2 mb-2 text-gray-300">
                                <Database size={16} />
                                <span className="font-medium">Cache Sistem</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Hapus cache untuk memperbarui konfigurasi global.</p>
                            <button className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors">
                                Bersihkan Cache
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link to Personal Settings */}
            <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-between">
                <div>
                    <h3 className="text-blue-400 font-bold mb-1">Pengaturan Akun Pribadi</h3>
                    <p className="text-gray-400 text-sm">Ingin mengubah kata sandi atau profil admin Anda?</p>
                </div>
                <Link href="/dashboard/user/settings" className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                    <SettingsIcon size={16} />
                    Buka Pengaturan Akun
                </Link>
            </div>
        </>
    )
}
