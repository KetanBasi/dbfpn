"use client"

import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    maxWidth?: string
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            window.addEventListener("keydown", handleEscape)
        }
        return () => window.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                ref={modalRef}
                className={`bg-[#1a1a1a] rounded-2xl shadow-2xl w-full mx-4 ${maxWidth} animate-in zoom-in-95 slide-in-from-bottom-4`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message: string
    confirmText?: string
    isLoading?: boolean
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Konfirmasi Hapus",
    message,
    confirmText = "Hapus",
    isLoading = false
}: DeleteConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? "Menghapus..." : confirmText}
                </button>
            </div>
        </Modal>
    )
}

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (reason: string) => void
    title?: string
    placeholder?: string
    isLoading?: boolean
}

export function ReportModal({
    isOpen,
    onClose,
    onSubmit,
    title = "Laporkan",
    placeholder = "Jelaskan alasan pelaporan...",
    isLoading = false
}: ReportModalProps) {
    const [reason, setReason] = useState("")

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason.trim())
            setReason("")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full bg-[#252525] text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
            />
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !reason.trim()}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? "Mengirim..." : "Kirim Laporan"}
                </button>
            </div>
        </Modal>
    )
}
