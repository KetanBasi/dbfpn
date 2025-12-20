"use client"

import { useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
  movieId: number
  userId: number
}

const clampRating = (v: number) => Math.min(5, Math.max(0, Number(v) || 0))

export default function RatingModal({ open, onClose, movieId, userId }: Props) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async () => {
    setError(null)

    const safeRating = clampRating(rating)

    if (safeRating < 1 || safeRating > 5) {
      setError("Pilih rating 1 sampai 5.")
      return
    }

    if (!Number.isInteger(movieId) || movieId <= 0 || !Number.isInteger(userId) || userId <= 0) {
      setError("movieId atau userId tidak valid.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          userId,
          rating: safeRating,
          comment,
        }),
      })

      const raw = await res.text()
      let data: any = null
      try {
        data = JSON.parse(raw)
      } catch {
        data = null
      }

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          raw ||
          `HTTP ${res.status}`
        setError(msg)
        return
      }

      setRating(0)
      setComment("")
      onClose()
    } catch (e: any) {
      setError(e?.message || "Network error. Coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={() => {
        if (!isSubmitting) onClose()
      }}
    >
      <div
        style={{
          background: "#111",
          padding: 20,
          borderRadius: 10,
          width: 400,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Beri Rating</h2>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: 30,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                color: star <= rating ? "gold" : "gray",
                opacity: isSubmitting ? 0.6 : 1,
              }}
              onClick={() => {
                if (!isSubmitting) setRating(star)
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Tulis komentar..."
          value={comment}
          disabled={isSubmitting}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 10,
            background: "#222",
            color: "white",
            borderRadius: 8,
            opacity: isSubmitting ? 0.6 : 1,
          }}
        />

        {error && (
          <p style={{ marginTop: 10, color: "salmon" }}>
            {error}
          </p>
        )}

        <div
          style={{
            marginTop: 15,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button disabled={isSubmitting} onClick={onClose}>
            Batal
          </button>
          <button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  )
}
