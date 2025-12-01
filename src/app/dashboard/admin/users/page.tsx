"use client"

import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Search, Filter, MoreHorizontal, Shield, Ban, CheckCircle, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/Toast"

export default function AdminUsers() {
    const [activeMenu, setActiveMenu] = useState<number | null>(null)
    const { showToast } = useToast()

    const toggleMenu = (id: number) => {
        if (activeMenu === id) {
            setActiveMenu(null)
        } else {
            setActiveMenu(id)
        }
    }

    const handleAction = (action: string, userName: string) => {
        showToast(`Pengguna ${userName} berhasil di-${action}`, "success")
        setActiveMenu(null)
    }

    // Mock Data
    const users = [
        { id: 1, name: "AdminUser", email: "admin@dbfpn.com", role: "admin", joined: "01 Des 2024", status: "active" },
        { id: 2, name: "RegularUser", email: "user@example.com", role: "user", joined: "05 Des 2024", status: "active" },
        { id: 3, name: "BannedUser", email: "bad@example.com", role: "user", joined: "06 Des 2024", status: "banned" },
    ]

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-white mb-8">Manajemen Pengguna</h1>

            {/* Search and Filter Bar */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan username, email..."
                        className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select className="bg-[#252525] border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                            <option value="">Semua Peran</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <Filter className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                    </div>
                    <div className="relative">
                        <select className="bg-[#252525] border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="banned">Diblokir</option>
                        </select>
                        <Filter className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-visible">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#252525] text-gray-200 uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Pengguna</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Peran</th>
                            <th className="px-6 py-4">Bergabung</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors relative">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-white">{user.name}</span>
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    {user.role === "admin" ? (
                                        <span className="flex items-center gap-1 text-primary"><Shield size={14} /> Admin</span>
                                    ) : (
                                        "User"
                                    )}
                                </td>
                                <td className="px-6 py-4">{user.joined}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                        }`}>
                                        {user.status === "active" ? "Aktif" : "Diblokir"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => toggleMenu(user.id)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === user.id && (
                                        <div className="absolute right-6 top-12 w-48 bg-[#252525] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                            <button className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-2 text-white">
                                                <Edit size={16} className="text-blue-400" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleAction("verifikasi", user.name)}
                                                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-2 text-white"
                                            >
                                                <CheckCircle size={16} className="text-green-400" /> Verifikasi
                                            </button>
                                            {user.role !== "admin" && (
                                                <button
                                                    onClick={() => handleAction(user.status === "active" ? "blokir" : "buka blokir", user.name)}
                                                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-2 text-red-400 border-t border-gray-700"
                                                >
                                                    <Ban size={16} /> {user.status === "active" ? "Blokir" : "Buka Blokir"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Click outside listener could be added here for better UX, but omitted for simplicity */}
            {activeMenu !== null && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveMenu(null)}></div>
            )}
        </DashboardLayout>
    )
}
