"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Edit3, X } from "lucide-react"
import { useToast } from "@/components/ui/Toast"
import { approveMovie, rejectMovie, requestRevision } from "@/app/actions/moderation"

type Props = {
    movieId: number
    movieTitle: string
}

export default function MovieModerationActions({ movieId, movieTitle }: Props) {
    const router = useRouter()
    const { showToast } = useToast()
    const [loading, setLoading] = useState<"approve" | "reject" | "revise" | null>(null)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showRevisionModal, setShowRevisionModal] = useState(false)
    const [reason, setReason] = useState("")

    const handleApprove = async () => {
        if (loading) return
        if (!confirm(`Setujui film "${movieTitle}"? Film akan tampil di publik.`)) return

        setLoading("approve")
        try {
            const result = await approveMovie(movieId)
            if (result.success) {
                showToast(result.message, "success")
                router.refresh()
            } else {
                showToast(result.message, "error")
            }
        } catch {
            showToast("Terjadi kesalahan.", "error")
        } finally {
            setLoading(null)
        }
    }

    const handleReject = async () => {
        if (loading) return
        if (!reason.trim()) {
            showToast("Alasan penolakan harus diisi.", "error")
            return
        }

        setLoading("reject")
        try {
            const result = await rejectMovie(movieId, reason)
            if (result.success) {
                showToast(result.message, "success")
                setShowRejectModal(false)
                setReason("")
                router.refresh()
            } else {
                showToast(result.message, "error")
            }
        } catch {
            showToast("Terjadi kesalahan.", "error")
        } finally {
            setLoading(null)
        }
    }

    const handleRevision = async () => {
        if (loading) return
        if (!reason.trim()) {
            showToast("Detail revisi harus diisi.", "error")
            return
        }

        setLoading("revise")
        try {
            const result = await requestRevision(movieId, reason)
            if (result.success) {
                showToast(result.message, "success")
                setShowRevisionModal(false)
                setReason("")
                router.refresh()
            } else {
                showToast(result.message, "error")
            }
        } catch {
            showToast("Terjadi kesalahan.", "error")
        } finally {
            setLoading(null)
        }
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleApprove}
                    disabled={loading !== null}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-sm font-medium disabled:opacity-50"
                    title="Setujui"
                >
                    <CheckCircle size={16} />
                    {loading === "approve" ? "..." : "Setujui"}
                </button>

                <button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    disabled={loading !== null}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium disabled:opacity-50"
                    title="Tolak"
                >
                    <XCircle size={16} />
                    Tolak
                </button>

                <button
                    type="button"
                    onClick={() => setShowRevisionModal(true)}
                    disabled={loading !== null}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-sm font-medium disabled:opacity-50"
                    title="Minta Revisi"
                >
                    <Edit3 size={16} />
                    Revisi
                </button>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <Modal
                    title={`Tolak "${movieTitle}"`}
                    onClose={() => { setShowRejectModal(false); setReason("") }}
                    onSubmit={handleReject}
                    loading={loading === "reject"}
                    submitText="Tolak Film"
                    submitColor="red"
                >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Alasan Penolakan
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Jelaskan mengapa film ini ditolak..."
                        className="w-full min-h-[120px] resize-none rounded-xl bg-[#252525] border border-gray-700 p-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                </Modal>
            )}

            {/* Revision Modal */}
            {showRevisionModal && (
                <Modal
                    title={`Minta Revisi: "${movieTitle}"`}
                    onClose={() => { setShowRevisionModal(false); setReason("") }}
                    onSubmit={handleRevision}
                    loading={loading === "revise"}
                    submitText="Kirim Permintaan Revisi"
                    submitColor="orange"
                >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Detail Revisi yang Diminta
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Jelaskan apa yang perlu direvisi..."
                        className="w-full min-h-[120px] resize-none rounded-xl bg-[#252525] border border-gray-700 p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                </Modal>
            )}
        </>
    )
}

// Reusable Modal component
function Modal({
    title,
    children,
    onClose,
    onSubmit,
    loading,
    submitText,
    submitColor
}: {
    title: string
    children: React.ReactNode
    onClose: () => void
    onSubmit: () => void
    loading: boolean
    submitText: string
    submitColor: "red" | "orange"
}) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose()
        }
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node) && !loading) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEsc)
        document.addEventListener("mousedown", handleClickOutside)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.removeEventListener("mousedown", handleClickOutside)
            document.body.style.overflow = "unset"
        }
    }, [loading, onClose])

    const btnClass = submitColor === "red"
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-orange-500 hover:bg-orange-600 text-white"

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {children}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className={`flex-1 px-4 py-3 rounded-xl font-bold disabled:opacity-50 ${btnClass}`}
                        >
                            {loading ? "Memproses..." : submitText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
