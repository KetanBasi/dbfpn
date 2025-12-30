import { Users, Film, MessageSquare, AlertTriangle } from "lucide-react"

export default async function AdminDashboard() {
    return (
        <>
            <h1 className="text-3xl font-bold text-white mb-8">Ringkasan Admin</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-400">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">1,234</div>
                    <div className="text-gray-400 text-sm">Total Pengguna</div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <Film size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-400">+5%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">456</div>
                    <div className="text-gray-400 text-sm">Total Film</div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                            <MessageSquare size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-400">+24%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">89</div>
                    <div className="text-gray-400 text-sm">Ulasan Baru</div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="text-xs font-bold text-red-400">3 Tertunda</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">12</div>
                    <div className="text-gray-400 text-sm">Laporan</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Approvals */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Persetujuan Tertunda</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#252525] rounded-lg">
                            <div>
                                <div className="font-bold text-white">Indie Movie Project 2025</div>
                                <div className="text-sm text-gray-400">Oleh @filmmaker_id</div>
                            </div>
                            <button className="px-3 py-1 bg-primary text-black text-xs font-bold rounded hover:bg-yellow-500">Review</button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#252525] rounded-lg">
                            <div>
                                <div className="font-bold text-white">Short Film: The Journey</div>
                                <div className="text-sm text-gray-400">Oleh @newbie_director</div>
                            </div>
                            <button className="px-3 py-1 bg-primary text-black text-xs font-bold rounded hover:bg-yellow-500">Review</button>
                        </div>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Laporan Terbaru</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#252525] rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold">!</div>
                                <div>
                                    <div className="font-bold text-white">SpamBot99</div>
                                    <div className="text-sm text-gray-400">Spam Link di Komentar</div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">15 Laporan</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#252525] rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold">!</div>
                                <div>
                                    <div className="font-bold text-white">FakeAdmin</div>
                                    <div className="text-sm text-gray-400">Penipuan Identitas</div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">5 Laporan</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
