"use client"

import { useState } from "react"
import { Star, Calendar, Award, Film, MessageSquare, Instagram, Twitter, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// We need to separate the client logic (collapsible chart) from the server data fetching.
// So we'll create a client component for the content and keep the page as server component.
// But for now, since the file is already a mix, let's refactor it properly.
// Wait, the previous file was a Server Component (async). I cannot use useState in it.
// I must refactor the interactive parts into a Client Component.

// Let's create a new component `UserProfileContent.tsx` and use it in `page.tsx`.
// But first, let's read the current file content again to be sure.
// I already read it in step 2436. It was a server component but had no interactivity yet.
// Now I need to add interactivity (collapsible chart).

// Strategy:
// 1. Rename current `page.tsx` logic to `UserProfileContent.tsx` (Client Component).
// 2. Update `page.tsx` to fetch data and pass it to `UserProfileContent`.

// Actually, I can just make a `RatingStats.tsx` client component and keep the rest server-side.
// That's cleaner.

export default function RatingStats({ ratingStats, totalRatings }: { ratingStats: Record<number, number>, totalRatings: number }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const scoresToShow = isExpanded ? [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : [10, 9, 8, 7]

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 sticky top-24">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Statistik Rating</h3>
            </div>

            <div className="space-y-3">
                {scoresToShow.map(score => (
                    <div key={score} className="flex items-center gap-3">
                        <div className="w-8 text-sm font-bold text-right">{score}</div>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${totalRatings > 0 ? (ratingStats[score] / totalRatings) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="w-6 text-xs text-gray-500 text-right">{ratingStats[score]}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-primary hover:text-white transition-colors"
            >
                {isExpanded ? (
                    <>Sembunyikan <ChevronUp size={16} /></>
                ) : (
                    <>Tampilkan Semua <ChevronDown size={16} /></>
                )}
            </button>
        </div>
    )
}
