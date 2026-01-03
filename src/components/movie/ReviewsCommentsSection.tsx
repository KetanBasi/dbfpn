"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MessageSquare, Star, ThumbsUp, ThumbsDown, MoreHorizontal, Flag, Link as LinkIcon, ChevronDown, ChevronUp, BadgeCheck, ShieldCheck, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/Toast"
import { DeleteConfirmModal, ReportModal } from "@/components/ui/Modal"
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
    isVerified: boolean
    isOwner: boolean
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
    onCopyLink,
    onReport,
    onDelete
}: {
    review: ReviewData
    movieSlug: string
    isLoggedIn: boolean
    currentUserId: number | null
    onVote: (reviewId: number, isAgree: boolean) => void
    onCopyLink: (reviewId: number) => void
    onReport: (reviewId: number, reason: string) => Promise<void>
    onDelete: (reviewId: number) => Promise<void>
}) {
    const [showOptions, setShowOptions] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isReporting, setIsReporting] = useState(false)
    const optionsRef = useRef<HTMLDivElement>(null)
    const displayName = review.name || review.username || `User`
    const initial = displayName.charAt(0).toUpperCase()
    const userProfileLink = review.username ? `/user/${review.username}` : null
    const hasContent = !!review.content

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

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
        <div id={`review-${review.id}`} className={`bg-[#252525] rounded-xl scroll-mt-24 ${hasContent ? 'p-4' : 'px-4 py-3'}`}>
            <div className="flex gap-3">
                <div className={`rounded-full bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center ${hasContent ? 'w-10 h-10' : 'w-8 h-8'}`}>
                    {review.avatar_url ? (
                        <Image src={review.avatar_url} alt={displayName} width={hasContent ? 40 : 32} height={hasContent ? 40 : 32} className="object-cover" />
                    ) : (
                        <span className={`text-white font-bold ${hasContent ? '' : 'text-sm'}`}>{initial}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm flex items-center gap-1">
                            {userProfileLink ? (
                                <Link href={userProfileLink} className="hover:text-primary transition-colors">
                                    {displayName}
                                </Link>
                            ) : displayName}
                            {/* Admin always gets verified badge */}
                            {(review.isVerified || review.isAdmin) && (
                                <BadgeCheck size={14} className="text-blue-400 fill-blue-400/20" />
                            )}
                            {review.isAdmin && (
                                <ShieldCheck size={14} className="text-green-400 fill-green-400/20" />
                            )}
                        </span>
                        <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                        <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString("id-ID")}
                        </span>
                    </div>
                    {hasContent && (
                        <p className="text-gray-300 text-sm mt-1 mb-2 whitespace-pre-wrap">{review.content}</p>
                    )}
                    <div className={`flex items-center gap-4 text-xs text-gray-500 ${hasContent ? '' : 'mt-1'}`}>
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

                        <div className="relative" ref={optionsRef}>
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className={`flex items-center gap-1 hover:text-white ${showOptions ? "text-white" : ""}`}
                            >
                                <MoreHorizontal size={14} /> Opsi
                            </button>
                            {showOptions && (
                                <div className="absolute left-0 mt-1 w-36 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-700 z-10">
                                    <button
                                        onClick={() => {
                                            onCopyLink(review.id)
                                            setShowOptions(false)
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <LinkIcon size={12} /> Salin Link
                                    </button>
                                    {isLoggedIn && !review.isOwner && (
                                        <button
                                            onClick={() => {
                                                setShowReportModal(true)
                                                setShowOptions(false)
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-white hover:bg-red-500/20 hover:text-red-400 flex items-center gap-2"
                                        >
                                            <Flag size={12} /> Laporkan
                                        </button>
                                    )}
                                    {review.isOwner && (
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(true)
                                                setShowOptions(false)
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 flex items-center gap-2"
                                        >
                                            <Trash2 size={12} /> Hapus Ulasan
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    setIsDeleting(true)
                    try {
                        await onDelete(review.id)
                        setShowDeleteModal(false)
                    } finally {
                        setIsDeleting(false)
                    }
                }}
                message="Yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan."
                isLoading={isDeleting}
            />

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={async (reason) => {
                    setIsReporting(true)
                    try {
                        await onReport(review.id, reason)
                        setShowReportModal(false)
                    } finally {
                        setIsReporting(false)
                    }
                }}
                title="Laporkan Ulasan"
                placeholder="Jelaskan alasan pelaporan ulasan ini..."
                isLoading={isReporting}
            />
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
                // Show all reviews (including rating-only)
                setReviews(data.reviews)
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

    const handleReport = async (reviewId: number, reason: string) => {
        try {
            const res = await fetch(`/api/reviews/${reviewId}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason })
            })
            const data = await res.json()

            if (data.success) {
                showToast("Laporan berhasil dikirim", "success")
            } else {
                showToast(data.error || "Gagal mengirim laporan", "error")
            }
        } catch (error) {
            console.error("Error reporting review:", error)
            showToast("Gagal mengirim laporan", "error")
        }
    }

    const handleDelete = async (reviewId: number) => {
        try {
            const res = await fetch("/api/reviews", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId })
            })
            const data = await res.json()

            if (data.success) {
                setReviews(reviews.filter(r => r.id !== reviewId))
                showToast("Ulasan berhasil dihapus", "success")
            } else {
                showToast(data.error || "Gagal menghapus ulasan", "error")
            }
        } catch (error) {
            console.error("Error deleting review:", error)
            showToast("Gagal menghapus ulasan", "error")
        }
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
                Belum ada ulasan untuk film ini.
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
                    onReport={handleReport}
                    onDelete={handleDelete}
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

                // Count all reviews (including rating-only)
                setReviewCount(reviewsData.reviews?.length || 0)
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
