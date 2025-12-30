"use client"

import { useState } from "react"
import RatingModal from "@/components/movie/RatingModal"

type Movie = {
  id: number
}

type MoviePageProps = {
  movie: Movie
}

export default function MoviePage({ movie }: MoviePageProps) {
  const [showRating, setShowRating] = useState(false)

  return (
    <>
      <button
        className="bg-yellow-500 px-4 py-2 rounded text-white"
        onClick={() => setShowRating(true)}
      >
        Rate This Movie
      </button>

      {showRating && (
        <RatingModal
          open={showRating}
          movieId={movie.id}
          userId={0}
          onClose={() => setShowRating(false)}
          onSuccess={() => {
            console.log("Rating OK")
            // TODO: Refetch rating stats
          }}
        />
      )}
    </>
  )
}
