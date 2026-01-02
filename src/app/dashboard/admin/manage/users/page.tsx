"use client"

import { useState } from "react"
import { Users, Search, Eye, Ban, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface UserResult {
    id: number
    username: string | null
    email: string
    name: string | null
    status: string
    role: string
    createdAt: string
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        active: "text-green-400 bg-green-500/10 border-green-500/20",
        banned: "text-red-400 bg-red-500/10 border-red-500/20",
        inactive: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    }
    const labels: Record<string, string> = {
        active: "Aktif",
        banned: "Banned",
        inactive: "Nonaktif",
    }
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status] || styles.inactive}`}>
            {labels[status] || status}
        </span>
    )
}

export default function ManageUsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState<UserResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserResult | null>(null)
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setLoading(true)
        setSearched(true)

        try {
            const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`)
            const data = await res.json()
            setUsers(data.users || [])
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (userId: number, action: "ban" | "unban" | "activate" | "deactivate") => {
        setActionLoading(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}/${action}`, { method: "POST" })
            if (res.ok) {
                // Refresh user list
                const updatedRes = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`)
                const data = await updatedRes.json()
                setUsers(data.users || [])
            }
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users size={22} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Kelola User</h1>
                    <p className="text-gray-400 text-sm">Cari pengguna, lihat detail, ban/unban, atau aktifkan/nonaktifkan akun.</p>
                </div>
            </div>

            {/* Search Form */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-8">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari username atau email..."
                            className="w-full bg-[#121212] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Mencari..." : "Cari"}
                    </button>
                </form>
            </div>

            {/* Results */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">
                        {searched ? `Hasil Pencarian "${searchQuery}"` : "Hasil Pencarian"}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {searched
                            ? `Ditemukan ${users.length} pengguna`
                            : "Masukkan kata kunci untuk mencari pengguna"}
                    </p>
                </div>

                <div className="p-6">
                    {!searched ? (
                        <div className="text-center py-12 text-gray-500">
                            <Search className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Gunakan form di atas untuk mencari pengguna.</p>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                            <p>Mencari...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Tidak ada pengguna yang cocok dengan pencarian.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user) => {
                                const displayName = user.name || user.username || user.email.split("@")[0]
                                const isBanned = user.status === "banned"
                                const isActive = user.status === "active"
                                const isAdmin = user.role === "admin"

                                return (
                                    <div key={user.id} className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-300 uppercase flex-shrink-0">
                                            {displayName.charAt(0)}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-white">{displayName}</h3>
                                                <StatusBadge status={user.status} />
                                                {isAdmin && (
                                                    <span className="px-2 py-1 rounded text-xs font-bold border text-primary bg-primary/10 border-primary/20">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {user.username && `@${user.username} · `}{user.email}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedUser(user)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm"
                                            >
                                                <Eye size={14} />
                                                Detail
                                            </button>

                                            {!isAdmin && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(user.id, isBanned ? "unban" : "ban")}
                                                        disabled={actionLoading === user.id}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isBanned
                                                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                                                : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                            } disabled:opacity-50`}
                                                    >
                                                        {isBanned ? <CheckCircle size={14} /> : <Ban size={14} />}
                                                        {isBanned ? "Unban" : "Ban"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(user.id, isActive ? "deactivate" : "activate")}
                                                        disabled={actionLoading === user.id || isBanned}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                                                                ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                                                                : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                        {isActive ? "Nonaktifkan" : "Aktifkan"}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-bold text-white">Detail Pengguna</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-300 text-2xl uppercase">
                                    {(selectedUser.name || selectedUser.username || selectedUser.email.split("@")[0]).charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">
                                        {selectedUser.name || selectedUser.username || selectedUser.email.split("@")[0]}
                                    </h3>
                                    {selectedUser.username && (
                                        <p className="text-gray-400">@{selectedUser.username}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="text-white">{selectedUser.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <StatusBadge status={selectedUser.status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Role</span>
                                    <span className="text-white capitalize">{selectedUser.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Bergabung</span>
                                    <span className="text-white">
                                        {new Date(selectedUser.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>

                            {selectedUser.username && (
                                <Link
                                    href={`/user/${selectedUser.username}`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors"
                                >
                                    <ExternalLink size={16} />
                                    Lihat Profil Publik
                                </Link>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-800">
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
