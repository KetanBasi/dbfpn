"use client"

import { MessageSquare, ThumbsUp, MoreHorizontal, Smile, BadgeCheck, ShieldCheck, Flag, Link as LinkIcon, Send, Trash2, ChevronDown, ChevronRight } from "lucide-react"
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
    deletedAt: string | null
    isOwner: boolean
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
    userAvatar,
    userName,
    autoFocus = false
}: {
    value: string
    onChange: (val: string) => void
    onSubmit: () => void
    placeholder: string
    isLoggedIn: boolean
    isLoading?: boolean
    userAvatar?: string | null
    userName?: string
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

    const initial = userName?.charAt(0).toUpperCase() || "U"

    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                    <Image src={userAvatar} alt={userName || "User"} width={40} height={40} className="object-cover" />
                ) : (
                    <span className="text-white font-bold">{initial}</span>
                )}
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
                                className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors disabled:opacity-50"
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
    currentUserId,
    userAvatar,
    userName,
    replyingTo,
    setReplyingTo,
    onVote,
    onReply,
    onDelete,
    onCopyLink,
    depth = 0
}: {
    comment: CommentData
    movieSlug: string
    isLoggedIn: boolean
    currentUserId: number | null
    userAvatar?: string | null
    userName?: string
    replyingTo: number | null
    setReplyingTo: (id: number | null) => void
    onVote: (commentId: number, isDislike: boolean) => void
    onReply: (parentId: number, content: string) => Promise<void>
    onDelete: (commentId: number) => Promise<void>
    onCopyLink: (commentId: number) => void
    depth?: number
}) {
    const [showOptions, setShowOptions] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
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
    const isDeleted = !!comment.deletedAt
    const hasReplies = comment.replies && comment.replies.length > 0

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

    const handleDelete = async () => {
        if (!confirm("Yakin ingin menghapus komentar ini?")) return
        setIsDeleting(true)
        try {
            await onDelete(comment.id)
            setShowOptions(false)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div id={`comment-${comment.id}`} className="scroll-mt-24 group">
            <div className="flex gap-2">
                {/* Collapsible thread line */}
                {depth > 0 && (
                    <div className="flex flex-col items-center w-5 flex-shrink-0">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="w-0.5 flex-1 bg-gray-700 hover:bg-primary transition-colors cursor-pointer"
                            title={isCollapsed ? "Buka balasan" : "Tutup balasan"}
                        />
                    </div>
                )}

                <div className="flex-1">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {!isDeleted && comment.user.avatarUrl ? (
                                <Image src={comment.user.avatarUrl} alt={displayName} width={32} height={32} className="object-cover" />
                            ) : (
                                <span className="text-white font-bold text-sm">{isDeleted ? "?" : initial}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className={`font-bold text-sm flex items-center gap-1 ${isDeleted ? "text-gray-500 italic" : "text-white"}`}>
                                    {isDeleted ? "[dihapus]" : displayName}
                                    {!isDeleted && comment.user.isAdmin && (
                                        <>
                                            <BadgeCheck size={14} className="text-blue-400 fill-blue-400/20" />
                                            <ShieldCheck size={14} className="text-green-400 fill-green-400/20" />
                                        </>
                                    )}
                                </span>
                                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString("id-ID")}</span>
                            </div>
                            <p className={`text-sm mb-2 whitespace-pre-wrap ${isDeleted ? "text-gray-500 italic" : "text-gray-300"}`}>
                                {comment.content}
                            </p>

                            {!isDeleted && (
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <button
                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                        className="flex items-center gap-1 hover:text-white"
                                        disabled={!isLoggedIn}
                                    >
                                        <MessageSquare size={12} /> Balas
                                    </button>
                                    <button
                                        onClick={() => onVote(comment.id, false)}
                                        className={`flex items-center gap-1 hover:text-white ${comment.userVote === "like" ? "text-green-400" : ""}`}
                                    >
                                        <ThumbsUp size={12} /> {comment.likes}
                                    </button>
                                    <button
                                        onClick={() => onVote(comment.id, true)}
                                        className={`flex items-center gap-1 hover:text-white ${comment.userVote === "dislike" ? "text-red-400" : ""}`}
                                    >
                                        <ThumbsUp size={12} className="rotate-180" /> {comment.dislikes}
                                    </button>

                                    <div className="relative" ref={optionsRef}>
                                        <button
                                            onClick={() => setShowOptions(!showOptions)}
                                            className={`flex items-center gap-1 hover:text-white ${showOptions ? "text-white" : ""}`}
                                        >
                                            <MoreHorizontal size={12} /> Opsi
                                        </button>
                                        {showOptions && (
                                            <div className="absolute left-0 mt-1 w-36 bg-[#252525] rounded-lg shadow-xl border border-gray-700 z-10">
                                                {comment.isOwner && (
                                                    <button
                                                        onClick={handleDelete}
                                                        disabled={isDeleting}
                                                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={12} /> {isDeleting ? "Menghapus..." : "Hapus Komentar"}
                                                    </button>
                                                )}
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
                            )}

                            {/* Reply Input */}
                            {replyingTo === comment.id && (
                                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                    <CommentInput
                                        value={replyContent}
                                        onChange={setReplyContent}
                                        onSubmit={handleSubmitReply}
                                        placeholder={`Balas ${displayName}...`}
                                        isLoggedIn={isLoggedIn}
                                        isLoading={isSubmitting}
                                        userAvatar={userAvatar}
                                        userName={userName}
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nested Replies */}
                    {hasReplies && (
                        isCollapsed ? (
                            <button
                                onClick={() => setIsCollapsed(false)}
                                className="mt-2 ml-11 px-3 py-1.5 text-xs text-primary bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center gap-1 transition-colors"
                            >
                                <ChevronRight size={14} />
                                {comment.replies.length} balasan tersembunyi
                            </button>
                        ) : (
                            <div className="mt-3 space-y-3">
                                {comment.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        movieSlug={movieSlug}
                                        isLoggedIn={isLoggedIn}
                                        currentUserId={currentUserId}
                                        userAvatar={userAvatar}
                                        userName={userName}
                                        replyingTo={replyingTo}
                                        setReplyingTo={setReplyingTo}
                                        onVote={onVote}
                                        onReply={onReply}
                                        onDelete={onDelete}
                                        onCopyLink={onCopyLink}
                                        depth={depth + 1}
                                    />
                                ))}
                            </div>
                        )
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
    const currentUserId = session?.user ? Number((session.user as any).id) : null
    const userAvatar = (session?.user as any)?.avatar_url
    const userName = (session?.user as any)?.name || (session?.user as any)?.username

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
                        element.classList.add("bg-primary/10", "rounded-lg")
                        setTimeout(() => {
                            element.classList.remove("bg-primary/10", "rounded-lg")
                        }, 3000)
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

    const handleDelete = async (commentId: number) => {
        try {
            const res = await fetch("/api/comments", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commentId })
            })
            const data = await res.json()

            if (data.success) {
                // Update comment to show as deleted
                const markAsDeleted = (comments: CommentData[]): CommentData[] => {
                    return comments.map(c => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                content: "[Komentar ini telah dihapus]",
                                deletedAt: new Date().toISOString()
                            }
                        }
                        if (c.replies.length > 0) {
                            return { ...c, replies: markAsDeleted(c.replies) }
                        }
                        return c
                    })
                }
                setComments(markAsDeleted(comments))
                showToast("Komentar berhasil dihapus", "success")
            } else {
                showToast(data.error || "Gagal menghapus komentar", "error")
            }
        } catch (error) {
            console.error("Error deleting comment:", error)
            showToast("Gagal menghapus komentar", "error")
        }
    }

    const handleCopyLink = (commentId: number) => {
        const url = `${window.location.origin}/movie/${movieSlug}#comment-${commentId}`
        navigator.clipboard.writeText(url)
        showToast("Link komentar disalin!", "success")
    }

    const getSortLabel = () => {
        switch (sortBy) {
            case "newest": return "Terbaru"
            case "oldest": return "Terlama"
            case "likes": return "Terpopuler"
        }
    }

    return (
        <div>
            {/* Sort */}
            <div className="flex justify-end mb-4">
                <div className="relative" ref={sortMenuRef}>
                    <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                    >
                        {getSortLabel()} <ChevronDown size={14} />
                    </button>
                    {showSortMenu && (
                        <div className="absolute right-0 mt-2 w-32 bg-[#252525] rounded-lg shadow-xl border border-gray-700 z-10 overflow-hidden">
                            <button onClick={() => handleSort("newest")} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary hover:text-black">Terbaru</button>
                            <button onClick={() => handleSort("oldest")} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary hover:text-black">Terlama</button>
                            <button onClick={() => handleSort("likes")} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary hover:text-black">Terpopuler</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Input */}
            <div className="mb-6">
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
                    userAvatar={userAvatar}
                    userName={userName}
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
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            movieSlug={movieSlug}
                            isLoggedIn={isLoggedIn}
                            currentUserId={currentUserId}
                            userAvatar={userAvatar}
                            userName={userName}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            onVote={handleVote}
                            onReply={handleReply}
                            onDelete={handleDelete}
                            onCopyLink={handleCopyLink}
                            depth={0}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
