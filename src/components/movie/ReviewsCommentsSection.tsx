"use client"

import { useState, useEffect, useCallback } from "react"
import { MessageSquare, Star, ThumbsUp, ThumbsDown, MoreHorizontal, Flag, Link as LinkIcon, ChevronDown, ChevronUp } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/Toast"
import Image from "next/image"
import Link from "next/link"

interface TabProps {
    movieId: number
    movieSlug: string
}

interface ReviewData {
    id: number
    rating: number
    content: string | null
    created_at: string
    name: string | null
    username: string | null
    avatar_url: string | null
    isAdmin: boolean
    agrees: number
    disagrees: number
    userVote: "agree" | "disagree" | null
}

function ReviewItem({
    review,
    movieSlug,
    isLoggedIn,
    currentUserId,
    onVote,
    onCopyLink
}: {
    review: ReviewData
    movieSlug: string
    isLoggedIn: boolean
    currentUserId: number | null
    onVote: (reviewId: number, isAgree: boolean) => void
    onCopyLink: (reviewId: number) => void
}) {
    const [showOptions, setShowOptions] = useState(false)
    const displayName = review.name || review.username || `User`
    const initial = displayName.charAt(0).toUpperCase()

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? "text-primary fill-primary" : "text-gray-600"}
            />
        ))
    }

    return (
        <div id={`review-${review.id}`} className="bg-[#252525] rounded-xl p-4 scroll-mt-24">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {review.avatar_url ? (
                        <Image src={review.avatar_url} alt={displayName} width={40} height={40} className="object-cover" />
                    ) : (
                        <span className="text-white font-bold">{initial}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{displayName}</span>
                        <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                        <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString("id-ID")}
                        </span>
                    </div>
                    {review.content && (
                        <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{review.content}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button
                            onClick={() => onVote(review.id, true)}
                            className={`flex items-center gap-1 hover:text-white ${review.userVote === "agree" ? "text-green-400" : ""}`}
                            disabled={!isLoggedIn}
                        >
                            <ThumbsUp size={14} /> Setuju ({review.agrees})
                        </button>
                        <button
                            onClick={() => onVote(review.id, false)}
                            className={`flex items-center gap-1 hover:text-white ${review.userVote === "disagree" ? "text-red-400" : ""}`}
                            disabled={!isLoggedIn}
                        >
                            <ThumbsDown size={14} /> Tidak Setuju ({review.disagrees})
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className={`flex items-center gap-1 hover:text-white ${showOptions ? "text-white" : ""}`}
                            >
                                <MoreHorizontal size={14} /> Opsi
                            </button>
                            {showOptions && (
                                <div className="absolute left-0 mt-1 w-32 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-700 z-10">
                                    <button
                                        onClick={() => {
                                            onCopyLink(review.id)
                                            setShowOptions(false)
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <LinkIcon size={12} /> Salin Link
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-xs text-white hover:bg-red-500/20 hover:text-red-400 flex items-center gap-2">
                                        <Flag size={12} /> Laporkan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ReviewsTab({ movieId, movieSlug }: TabProps) {
    const { data: session } = useSession()
    const { showToast } = useToast()
    const [reviews, setReviews] = useState<ReviewData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const isLoggedIn = !!session?.user
    const currentUserId = session?.user ? Number((session.user as any).id) : null

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch(`/api/reviews?movieId=${movieId}`)
            const data = await res.json()
            if (data.reviews) {
                // Filter to only show reviews with content
                setReviews(data.reviews.filter((r: ReviewData) => r.content))
            }
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setIsLoading(false)
        }
    }, [movieId])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const handleVote = async (reviewId: number, isAgree: boolean) => {
        if (!isLoggedIn) {
            showToast("Silakan login untuk memberi vote", "info")
            return
        }

        try {
            const res = await fetch(`/api/reviews/${reviewId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAgree })
            })
            const data = await res.json()

            if (data.success) {
                setReviews(reviews.map(r =>
                    r.id === reviewId
                        ? { ...r, agrees: data.agrees, disagrees: data.disagrees, userVote: data.userVote }
                        : r
                ))
            }
        } catch (error) {
            console.error("Error voting:", error)
        }
    }

    const handleCopyLink = (reviewId: number) => {
        const url = `${window.location.origin}/movie/${movieSlug}#review-${reviewId}`
        navigator.clipboard.writeText(url)
        showToast("Link ulasan disalin!", "success")
    }

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                Memuat ulasan...
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Belum ada ulasan dengan deskripsi.</p>
                <p className="text-xs mt-1">Rating tanpa ulasan tetap dihitung di rata-rata.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewItem
                    key={review.id}
                    review={review}
                    movieSlug={movieSlug}
                    isLoggedIn={isLoggedIn}
                    currentUserId={currentUserId}
                    onVote={handleVote}
                    onCopyLink={handleCopyLink}
                />
            ))}
        </div>
    )
}

// Re-export CommentsSection as CommentsTab (will use the existing component)
import CommentsSection from "./CommentsSection"

function CommentsTab({ movieId, movieSlug }: TabProps) {
    return <CommentsSection movieId={movieId} movieSlug={movieSlug} />
}

export default function ReviewsCommentsSection({ movieId, movieSlug }: TabProps) {
    const [activeTab, setActiveTab] = useState<"reviews" | "comments">("reviews")
    const [reviewCount, setReviewCount] = useState(0)
    const [commentCount, setCommentCount] = useState(0)

    // Fetch counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [reviewsRes, commentsRes] = await Promise.all([
                    fetch(`/api/reviews?movieId=${movieId}`),
                    fetch(`/api/comments?movieId=${movieId}`)
                ])
                const reviewsData = await reviewsRes.json()
                const commentsData = await commentsRes.json()

                // Count reviews with content
                setReviewCount(reviewsData.reviews?.filter((r: any) => r.content).length || 0)
                setCommentCount(commentsData.total || 0)
            } catch (error) {
                console.error("Error fetching counts:", error)
            }
        }
        fetchCounts()
    }, [movieId])

    return (
        <div className="bg-[#1a1a1a] rounded-t-2xl p-6 mt-8">
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "reviews"
                        ? "text-primary border-primary"
                        : "text-gray-400 border-transparent hover:text-white"
                        }`}
                >
                    <Star size={18} />
                    Ulasan ({reviewCount})
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "comments"
                        ? "text-primary border-primary"
                        : "text-gray-400 border-transparent hover:text-white"
                        }`}
                >
                    <MessageSquare size={18} />
                    Komentar ({commentCount})
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "reviews" ? (
                <ReviewsTab movieId={movieId} movieSlug={movieSlug} />
            ) : (
                <CommentsTab movieId={movieId} movieSlug={movieSlug} />
            )}
        </div>
    )
}
