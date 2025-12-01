"use client"

import { useState, useEffect, useRef } from "react"
import { Star, X } from "lucide-react"
import { useToast } from "../ui/Toast"

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
    movieTitle: string
    initialRating?: number
}

export default function ReviewModal({ isOpen, onClose, movieTitle, initialRating = 0 }: ReviewModalProps) {
    const [rating, setRating] = useState(initialRating)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState("")
    const modalRef = useRef<HTMLDivElement>(null)
    const { showToast } = useToast()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleSubmit = () => {
        // Handle submission logic here
        console.log({ rating, review })
        showToast("Ulasan berhasil dikirim!", "success")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-gray-800 shadow-2xl transform transition-all"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Beri Ulasan</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-center text-gray-400 mb-6">
                        Bagaimana pendapatmu tentang <span className="text-white font-bold">{movieTitle}</span>?
                    </p>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    size={28}
                                    className={`${star <= (hoverRating || rating)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-600"
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Rating Value Display */}
                    <div className="text-center mb-6">
                        <span className="text-3xl font-bold text-white">{(hoverRating || rating)}</span>
                        <span className="text-gray-500 text-lg">/10</span>
                    </div>

                    {/* Review Textarea */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Ulasan Anda (Opsional)</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Ceritakan pengalaman menontonmu..."
                            className="w-full bg-[#252525] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary min-h-[120px] resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-black font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Kirim Ulasan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
