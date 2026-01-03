"use client"

import { MessageSquare, ThumbsUp, MoreHorizontal, Smile, BadgeCheck, ShieldCheck, Flag, Link as LinkIcon, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/Toast"

const EMOJIS = ["😀", "😂", "😍", "🔥", "👍", "👎", "😭", "😱", "🤔", "💩"]

interface CommentUser {
    id: number
    username: string | null
    name: string | null
    avatarUrl: string | null
    isAdmin: boolean
}

interface CommentData {
    id: number
    content: string
    createdAt: string
    user: CommentUser
    likes: number
    dislikes: number
    userVote: "like" | "dislike" | null
    replies: CommentData[]
}

// Reusable Input Component
function CommentInput({
    value,
    onChange,
    onSubmit,
    placeholder,
    isLoggedIn,
    isLoading,
    autoFocus = false
}: {
    value: string
    onChange: (val: string) => void
    onSubmit: () => void
    placeholder: string
    isLoggedIn: boolean
    isLoading?: boolean
    autoFocus?: boolean
}) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const emojiRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const addEmoji = (emoji: string) => {
        onChange(value + emoji)
        setShowEmojiPicker(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault()
            onSubmit()
        }
    }

    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <span className="text-white font-bold">U</span>
            </div>
            <div className="flex-1">
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={!isLoggedIn || isLoading}
                            autoFocus={autoFocus}
                            className="w-full bg-[#252525] text-white p-3 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="absolute right-2 top-2" ref={emojiRef}>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                disabled={!isLoggedIn}
                                className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <Smile size={20} />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute right-0 bottom-full mb-2 bg-[#252525] border border-gray-700 rounded-lg p-2 grid grid-cols-5 gap-1 shadow-xl z-20 w-48">
                                    {EMOJIS.map(emoji => (
                                        <button key={emoji} onClick={() => addEmoji(emoji)} className="text-xl hover:bg-gray-700 rounded p-1">
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onSubmit}
                        disabled={!isLoggedIn || !value.trim() || isLoading}
                        className="px-4 py-2 bg-primary text-black rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 transition-colors flex items-center gap-2"
                    >
                        <Send size={16} /> {isLoading ? "..." : "Kirim"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Comment Item Component
function CommentItem({
    comment,
    movieSlug,
    isLoggedIn,
    replyingTo,
    setReplyingTo,
    onVote,
    onReply,
    onCopyLink
}: {
    comment: CommentData
    movieSlug: string
    isLoggedIn: boolean
    replyingTo: number | null
    setReplyingTo: (id: number | null) => void
    onVote: (commentId: number, isDislike: boolean) => void
    onReply: (parentId: number, content: string) => Promise<void>
    onCopyLink: (commentId: number) => void
}) {
    const [showOptions, setShowOptions] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const optionsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const displayName = comment.user.name || comment.user.username || `User#${comment.user.id}`
    const initial = displayName.charAt(0).toUpperCase()

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return
        setIsSubmitting(true)
        try {
            await onReply(comment.id, replyContent)
            setReplyContent("")
            setReplyingTo(null)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div id={`comment-${comment.id}`} className="scroll-mt-24">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {comment.user.avatarUrl ? (
                        <Image src={comment.user.avatarUrl} alt={displayName} width={40} height={40} className="object-cover" />
                    ) : (
                        <span className="text-white font-bold">{initial}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm flex items-center gap-1">
                            {displayName}
                            {comment.user.isAdmin && (
                                <>
                                    <BadgeCheck size={16} className="text-blue-400 fill-blue-400/20" />
                                    <ShieldCheck size={16} className="text-green-400 fill-green-400/20" />
                                </>
                            )}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">
                        {comment.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 hover:text-white"
                            disabled={!isLoggedIn}
                        >
                            <MessageSquare size={14} /> Balas
                        </button>
                        <button
                            onClick={() => onVote(comment.id, false)}
                            className={`flex items-center gap-1 hover:text-white ${comment.userVote === "like" ? "text-green-400" : ""}`}
                        >
                            <ThumbsUp size={14} /> {comment.likes}
                        </button>
                        <button
                            onClick={() => onVote(comment.id, true)}
                            className={`flex items-center gap-1 hover:text-white ${comment.userVote === "dislike" ? "text-red-400" : ""}`}
                        >
                            <ThumbsUp size={14} className="rotate-180" /> {comment.dislikes}
                        </button>

                        <div className="relative" ref={optionsRef}>
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className={`flex items-center gap-1 hover:text-white ${showOptions ? "text-white" : ""}`}
                            >
                                <MoreHorizontal size={14} /> Opsi
                            </button>
                            {showOptions && (
                                <div className="absolute left-0 mt-1 w-32 bg-[#252525] rounded-lg shadow-xl border border-gray-700 z-10">
                                    <button className="w-full text-left px-3 py-2 text-xs text-white hover:bg-red-500/20 hover:text-red-400 flex items-center gap-2">
                                        <Flag size={12} /> Laporkan
                                    </button>
                                    <button
                                        onClick={() => {
                                            onCopyLink(comment.id)
                                            setShowOptions(false)
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <LinkIcon size={12} /> Salin Link
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <CommentInput
                                value={replyContent}
                                onChange={setReplyContent}
                                onSubmit={handleSubmitReply}
                                placeholder={`Balas ${displayName}...`}
                                isLoggedIn={isLoggedIn}
                                isLoading={isSubmitting}
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-800">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    movieSlug={movieSlug}
                                    isLoggedIn={isLoggedIn}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    onVote={onVote}
                                    onReply={onReply}
                                    onCopyLink={onCopyLink}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface CommentsSectionProps {
    movieId: number
    movieSlug: string
}

export default function CommentsSection({ movieId, movieSlug }: CommentsSectionProps) {
    const { data: session } = useSession()
    const { showToast } = useToast()

    const [comments, setComments] = useState<CommentData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes">("newest")
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const sortMenuRef = useRef<HTMLDivElement>(null)

    const isLoggedIn = !!session?.user

    // Fetch comments
    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?movieId=${movieId}`)
            const data = await res.json()
            if (data.comments) {
                setComments(data.comments)
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
        } finally {
            setIsLoading(false)
        }
    }, [movieId])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    // Scroll to comment on hash
    useEffect(() => {
        if (typeof window !== "undefined" && window.location.hash) {
            const hash = window.location.hash
            if (hash.startsWith("#comment-")) {
                setTimeout(() => {
                    const element = document.querySelector(hash)
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" })
                        element.classList.add("bg-primary/10")
                        setTimeout(() => element.classList.remove("bg-primary/10"), 3000)
                    }
                }, 500)
            }
        }
    }, [comments])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setShowSortMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSort = (type: "newest" | "oldest" | "likes") => {
        setSortBy(type)
        setShowSortMenu(false)
        const sorted = [...comments].sort((a, b) => {
            if (type === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            if (type === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            if (type === "likes") return b.likes - a.likes
            return 0
        })
        setComments(sorted)
    }

    const handleVote = async (commentId: number, isDislike: boolean) => {
        if (!isLoggedIn) {
            showToast("Silakan login untuk memberi vote", "info")
            return
        }

        try {
            const res = await fetch(`/api/comments/${commentId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDislike })
            })
            const data = await res.json()

            if (data.success) {
                // Update comment in state
                const updateCommentVotes = (comments: CommentData[]): CommentData[] => {
                    return comments.map(c => {
                        if (c.id === commentId) {
                            return { ...c, likes: data.likes, dislikes: data.dislikes, userVote: data.userVote }
                        }
                        if (c.replies.length > 0) {
                            return { ...c, replies: updateCommentVotes(c.replies) }
                        }
                        return c
                    })
                }
                setComments(updateCommentVotes(comments))
            }
        } catch (error) {
            console.error("Error voting:", error)
        }
    }

    const handleSubmitComment = async () => {
        if (!newComment.trim() || isSubmitting) return
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId, content: newComment })
            })
            const data = await res.json()

            if (data.success) {
                setComments([data.comment, ...comments])
                setNewComment("")
                showToast("Komentar berhasil dikirim!", "success")
            } else {
                showToast(data.error || "Gagal mengirim komentar", "error")
            }
        } catch (error) {
            console.error("Error submitting comment:", error)
            showToast("Gagal mengirim komentar", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReply = async (parentId: number, content: string) => {
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId, content, parentId })
            })
            const data = await res.json()

            if (data.success) {
                // Add reply to parent comment
                const addReplyToComment = (comments: CommentData[]): CommentData[] => {
                    return comments.map(c => {
                        if (c.id === parentId) {
                            return { ...c, replies: [...c.replies, data.comment] }
                        }
                        if (c.replies.length > 0) {
                            return { ...c, replies: addReplyToComment(c.replies) }
                        }
                        return c
                    })
                }
                setComments(addReplyToComment(comments))
                showToast("Balasan berhasil dikirim!", "success")
            } else {
                showToast(data.error || "Gagal mengirim balasan", "error")
            }
        } catch (error) {
            console.error("Error submitting reply:", error)
            showToast("Gagal mengirim balasan", "error")
        }
    }

    const handleCopyLink = (commentId: number) => {
        const url = `${window.location.origin}/movie/${movieSlug}#comment-${commentId}`
        navigator.clipboard.writeText(url)
        showToast("Link komentar disalin!", "success")
    }

    const getSortLabel = () => {
        switch (sortBy) {
            case "newest": return "Urut Terbaru"
            case "oldest": return "Urut Terlama"
            case "likes": return "Urut Terpopuler"
        }
    }

    return (
        <div className="bg-[#1a1a1a] rounded-t-2xl p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare size={20} /> {comments.length} Komentar
                </h3>
                <div className="relative" ref={sortMenuRef}>
                    <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                    >
                        {getSortLabel()} <span className="text-xs">▼</span>
                    </button>
                    {showSortMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-[#252525] rounded-lg shadow-xl border border-gray-700 z-10 overflow-hidden">
                            <button onClick={() => handleSort("newest")} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary hover:text-black">Terbaru</button>
                            <button onClick={() => handleSort("oldest")} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary hover:text-black">Terlama</button>
                            <button onClick={() => handleSort("likes")} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary hover:text-black">Terpopuler</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Input */}
            <div className="mb-8">
                {!isLoggedIn && (
                    <Link href="/signin" className="text-primary text-sm mb-2 hover:underline block w-fit ml-14">
                        Sign in untuk berkomentar
                    </Link>
                )}
                <CommentInput
                    value={newComment}
                    onChange={setNewComment}
                    onSubmit={handleSubmitComment}
                    placeholder={isLoggedIn ? "Tinggalkan komentar..." : "Silakan login terlebih dahulu"}
                    isLoggedIn={isLoggedIn}
                    isLoading={isSubmitting}
                />
            </div>

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                    Memuat komentar...
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            movieSlug={movieSlug}
                            isLoggedIn={isLoggedIn}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            onVote={handleVote}
                            onReply={handleReply}
                            onCopyLink={handleCopyLink}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
