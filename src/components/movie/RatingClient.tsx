"use client"

import { useState } from "react"
import RatingModal from "@/components/movie/RatingModal"

export default function RatingClient({ movieId }: { movieId: number }) {
  const [open, setOpen] = useState(false)

  const userId = 1 // dummy, ganti nanti dari session

  return (
    <div className="my-6">
      <button
        className="px-4 py-2 rounded bg-yellow-400 font-bold"
        onClick={() => setOpen(true)}
      >
        ⭐ Beri Rating
      </button>

      <RatingModal
        open={open}
        onClose={() => setOpen(false)}
        movieId={movieId}
        userId={userId}
      />
    </div>
  )
}
