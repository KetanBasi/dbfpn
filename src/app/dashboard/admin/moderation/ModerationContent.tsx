"use client"

import { useState } from "react"
import { Film, User, MessageSquare, Check, X, AlertTriangle, Eye, Ban, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/Toast"

export default function ModerationContent() {
    const [activeTab, setActiveTab] = useState<"movies" | "accounts" | "comments">("movies")
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
    const [isRevisionMode, setIsRevisionMode] = useState(false)
    const [revisionFeedback, setRevisionFeedback] = useState("")

    // Moderation Note State
    const [moderationNote, setModerationNote] = useState("")
    const [actionId, setActionId] = useState<number | null>(null)
    const [actionType, setActionType] = useState<"block_user" | "remove_comment" | "remove_block" | "block_account" | null>(null)
    const { showToast } = useToast()

    // Mock Data - Movies
    const submissions = [
        {
            id: 1,
            title: "Indie Movie Project 2025",
            submitter: "filmmaker_id",
            time: "2 jam yang lalu",
            synopsis: "Sebuah film dokumenter tentang perkembangan industri film independen di Indonesia...",
            director: "Budi Santoso",
            writer: "Andi Wijaya",
            cast: [
                { name: "Reza Rahadian", role: "Narator" },
                { name: "Dian Sastrowardoyo", role: "Narasumber" }
            ],
            year: "2025",
            trailer: "https://youtube.com/watch?v=...",
            status: "Menunggu Moderasi"
        },
        {
            id: 2,
            title: "Short Film: The Journey",
            submitter: "newbie_director",
            time: "5 jam yang lalu",
            synopsis: "Perjalanan seorang anak mencari arti rumah...",
            director: "Siti Aminah",
            writer: "Siti Aminah",
            cast: [
                { name: "Adhisty Zara", role: "Anak" },
                { name: "Slamet Rahardjo", role: "Kakek" }
            ],
            year: "2024",
            trailer: "https://youtube.com/watch?v=...",
            status: "Menunggu Moderasi"
        }
    ]

    // Mock Data - Accounts
    const reportedAccounts = [
        { id: 1, username: "SpamBot99", reason: "Spam Link di Komentar", reports: 15, status: "Pending" },
        { id: 2, username: "FakeAdmin", reason: "Penipuan Identitas", reports: 5, status: "Pending" }
    ]

    const openSubmission = (submission: any) => {
        setSelectedSubmission(submission)
        setIsRevisionMode(false)
        setRevisionFeedback("")
    }

    const closeSubmission = () => {
        setSelectedSubmission(null)
    }

    const initiateAction = (id: number, type: "block_user" | "remove_comment" | "remove_block" | "block_account") => {
        setActionId(id)
        setActionType(type)
        setModerationNote("")
    }

    const confirmAction = () => {
        // Handle action logic here
        showToast(`Aksi: ${actionType?.replace('_', ' ')} berhasil dilakukan`, "success")
        setActionId(null)
        setActionType(null)
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-white mb-8">Moderasi</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-6">
                <button
                    onClick={() => setActiveTab("movies")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "movies" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    <Film size={18} />
                    Kiriman Film
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{submissions.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab("accounts")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "accounts" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    <User size={18} />
                    Akun
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{reportedAccounts.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    <MessageSquare size={18} />
                    Komentar
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">5</span>
                </button>
            </div>

            {/* Content */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 min-h-[400px]">

                {/* Movie Submissions Tab */}
                {activeTab === "movies" && (
                    <div className="space-y-4">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="bg-[#252525] p-4 rounded-lg flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-bold text-lg">{sub.title}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase">{sub.status}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">Dikirim oleh: <span className="text-primary">@{sub.submitter}</span> • {sub.time}</p>
                                    <p className="text-gray-300 mt-3 text-sm line-clamp-2">{sub.synopsis}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openSubmission(sub)}
                                        className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-yellow-500 flex items-center gap-2"
                                    >
                                        <Eye size={16} /> Lihat Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Accounts Tab */}
                {activeTab === "accounts" && (
                    <div className="space-y-4">
                        {reportedAccounts.map((acc) => (
                            <div key={acc.id} className="bg-[#252525] p-4 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                        {acc.username.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{acc.username}</h3>
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {acc.reason}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 text-sm">{acc.reports} Laporan</span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600">Abaikan</button>
                                        <button
                                            onClick={() => initiateAction(acc.id, "block_account")}
                                            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 flex items-center gap-1"
                                        >
                                            <Ban size={16} /> Blokir Akun
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Comments Tab */}
                {activeTab === "comments" && (
                    <div className="space-y-4">
                        <div className="bg-[#252525] p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">S</div>
                                    <div>
                                        <div className="text-white font-bold text-sm">SpammerUser</div>
                                        <div className="text-xs text-gray-500">10 menit lalu • di film <span className="text-gray-300">Inception</span></div>
                                    </div>
                                    <span className="text-red-400 flex items-center gap-1 text-xs font-bold bg-red-500/10 px-2 py-1 rounded ml-2"><AlertTriangle size={12} /> Spam Link</span>
                                </div>
                            </div>
                            <p className="text-white text-sm bg-black/30 p-3 rounded border border-gray-700 mb-3 ml-11">
                                &quot;Tonton film gratis di website ini: www.scam-movie-site.com/free&quot;
                            </p>
                            <div className="flex justify-end gap-2">
                                <button className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600">Abaikan</button>
                                <button
                                    onClick={() => initiateAction(1, "remove_comment")}
                                    className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-bold hover:bg-yellow-500/30 flex items-center gap-1"
                                >
                                    <Trash2 size={16} /> Hapus
                                </button>
                                <button
                                    onClick={() => initiateAction(1, "remove_block")}
                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 flex items-center gap-1"
                                >
                                    <Ban size={16} /> Hapus & Blokir
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Action Confirmation Modal (Note Input) */}
            {actionId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Konfirmasi Tindakan</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Anda akan melakukan tindakan <strong>{actionType?.replace('_', ' ')}</strong>. Mohon berikan alasan untuk catatan moderasi.
                        </p>
                        <textarea
                            value={moderationNote}
                            onChange={(e) => setModerationNote(e.target.value)}
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary h-24 mb-4"
                            placeholder="Alasan moderasi..."
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setActionId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                            <button onClick={confirmAction} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">Konfirmasi</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Detail Kiriman</h2>
                            <button onClick={closeSubmission} className="text-gray-500 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Judul</label>
                                    <p className="text-white font-medium">{selectedSubmission.title}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Tahun</label>
                                    <p className="text-white font-medium">{selectedSubmission.year}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Penulis</label>
                                    <p className="text-white font-medium">{selectedSubmission.writer}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Sutradara</label>
                                    <p className="text-white font-medium">{selectedSubmission.director}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Sinopsis</label>
                                <p className="text-gray-300 mt-1">{selectedSubmission.synopsis}</p>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Pemeran</label>
                                <div className="space-y-2">
                                    {selectedSubmission.cast.map((actor: any, idx: number) => (
                                        <div key={idx} className="flex justify-between bg-[#252525] p-2 rounded border border-gray-700">
                                            <span className="text-white font-medium">{actor.name}</span>
                                            <span className="text-gray-400 text-sm">{actor.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Trailer</label>
                                <a href={selectedSubmission.trailer} target="_blank" rel="noreferrer" className="block text-primary hover:underline mt-1 truncate">
                                    {selectedSubmission.trailer}
                                </a>
                            </div>

                            {isRevisionMode && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                                    <label className="block text-sm font-bold text-yellow-400 mb-2">Catatan Revisi</label>
                                    <textarea
                                        value={revisionFeedback}
                                        onChange={(e) => setRevisionFeedback(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 h-24"
                                        placeholder="Jelaskan apa yang perlu diperbaiki..."
                                    ></textarea>
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button onClick={() => setIsRevisionMode(false)} className="px-3 py-1.5 text-gray-400 hover:text-white text-sm">Batal</button>
                                        <button className="px-3 py-1.5 bg-yellow-500 text-black font-bold rounded-lg text-sm hover:bg-yellow-400">Kirim Revisi</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-[#252525]">
                            {!isRevisionMode && (
                                <>
                                    <button onClick={() => setIsRevisionMode(true)} className="px-4 py-2 bg-yellow-500/20 text-yellow-400 font-bold rounded-lg hover:bg-yellow-500/30">
                                        Minta Revisi
                                    </button>
                                    <button className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500/30">
                                        Tolak
                                    </button>
                                    <button className="px-4 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400">
                                        Setujui & Terbitkan
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
