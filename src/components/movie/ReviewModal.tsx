"use client"

import { useState, useEffect, useRef } from "react"
import { Star, X } from "lucide-react"
import { useToast } from "../ui/Toast"
import { submitReview } from "@/app/actions/review"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number
  movieTitle: string
  initialRating?: number
}

const clampRating = (v: number) => Math.min(5, Math.max(0, Number(v) || 0))

export default function ReviewModal({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  initialRating = 0,
}: ReviewModalProps) {
  const [rating, setRating] = useState(clampRating(initialRating))
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!isSubmitting) onClose()
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
  }, [isOpen, onClose, isSubmitting])

  useEffect(() => {
    if (!isOpen) return
    setRating(clampRating(initialRating))
    setHoverRating(0)
    setReview("")
  }, [isOpen, initialRating])

  if (!isOpen) return null

  const handleSubmit = async () => {
    const safeRating = clampRating(rating)

    if (safeRating < 1 || safeRating > 5) {
      showToast("Pilih rating 1 sampai 5.", "error")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitReview(movieId, safeRating, review)
      if (result?.success) {
        showToast("Ulasan berhasil dikirim!", "success")
        onClose()
      } else {
        showToast(result?.error || "Gagal mengirim ulasan", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = clampRating(hoverRating || rating)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-gray-800 shadow-2xl transform transition-all"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Beri Ulasan</h2>
          <button
            onClick={() => {
              if (!isSubmitting) onClose()
            }}
            className="text-gray-400 hover:text-white transition-colors"
            type="button"
            aria-label="Tutup"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-400 mb-6">
            Bagaimana pendapatmu tentang <span className="text-white font-bold">{movieTitle}</span>?
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isSubmitting}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={`Pilih rating ${star}`}
              >
                <Star
                  size={28}
                  className={`${
                    star <= (hoverRating || rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div className="text-center mb-6">
            <span className="text-3xl font-bold text-white">{displayRating}</span>
            <span className="text-gray-500 text-lg">/5</span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Ulasan Anda (Opsional)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Ceritakan pengalaman menontonmu..."
              disabled={isSubmitting}
              className="w-full bg-[#252525] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary min-h-[120px] resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (!isSubmitting) onClose()
              }}
              type="button"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              disabled={displayRating === 0 || isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-primary text-black font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
