"use client"

import { MessageSquare, ThumbsUp, MoreHorizontal, Smile, BadgeCheck, ShieldCheck, Flag, Link as LinkIcon, Send } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// Mock Data
const INITIAL_COMMENTS = [
    {
        id: 1,
        user: "Pengguna Lain #1",
        avatar: null,
        date: "2025-12-12T10:00:00",
        content: "Dag dig dug serrr.....",
        likes: 12,
        dislikes: 0,
        isVerified: true,
        isAdmin: true,
        replies: []
    },
    {
        id: 2,
        user: "Pengguna Lain #2",
        avatar: null,
        date: "2025-12-12T11:30:00",
        content: "Hidup penuh masalah? Skill issue...",
        likes: 5,
        dislikes: 2,
        isVerified: true,
        isAdmin: false,
        replies: []
    },
    {
        id: 3,
        user: "Pengguna Lain #3",
        avatar: null,
        date: "2025-12-12T12:15:00",
        content: "Bajigur plot twist nya",
        likes: 8,
        dislikes: 1,
        isVerified: false,
        isAdmin: false,
        replies: [
            {
                id: 31,
                user: "Balasan User",
                avatar: null,
                date: "2025-12-12T12:20:00",
                content: "Setuju banget bang!",
                likes: 2,
                dislikes: 0,
                isVerified: false,
                isAdmin: false,
                replies: []
            }
        ]
    }
]

const EMOJIS = ["😀", "😂", "😍", "🔥", "👍", "👎", "😭", "😱", "🤔", "💩"]

// Reusable Input Component
function CommentInput({
    value,
    onChange,
    onSubmit,
    placeholder,
    isLoggedIn,
    autoFocus = false
}: {
    value: string
    onChange: (val: string) => void
    onSubmit: () => void
    placeholder: string
    isLoggedIn: boolean
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

    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-bold">U</span>
            </div>
            <div className="flex-1">
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            disabled={!isLoggedIn}
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
                        disabled={!isLoggedIn || !value.trim()}
                        className="px-4 py-2 bg-primary text-black rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 transition-colors flex items-center gap-2"
                    >
                        <Send size={16} /> Kirim
                    </button>
                </div>
            </div>
        </div>
    )
}

// Comment Item Component
function CommentItem({
    comment,
    isLoggedIn,
    replyingTo,
    setReplyingTo,
    handleLike,
    handleCopyLink
}: {
    comment: any
    isLoggedIn: boolean
    replyingTo: number | null
    setReplyingTo: (id: number | null) => void
    handleLike: (id: number, isDislike: boolean) => void
    handleCopyLink: (id: number) => void
}) {
    const [showOptions, setShowOptions] = useState(false)
    const [replyContent, setReplyContent] = useState("")
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

    return (
        <div id={`comment-${comment.id}`}>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                    {/* Placeholder avatar */}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm flex items-center gap-1">
                            {comment.user}
                            {comment.isAdmin && (
                                <>
                                    <BadgeCheck size={16} className="text-blue-400 fill-blue-400/20" />
                                    <ShieldCheck size={16} className="text-green-400 fill-green-400/20" />
                                </>
                            )}
                            {comment.isVerified && !comment.isAdmin && (
                                <BadgeCheck size={16} className="text-blue-400 fill-blue-400/20" />
                            )}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                        {comment.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 hover:text-white"
                        >
                            <MessageSquare size={14} /> Balas
                        </button>
                        <button onClick={() => handleLike(comment.id, false)} className="flex items-center gap-1 hover:text-white">
                            <ThumbsUp size={14} /> {comment.likes}
                        </button>
                        <button onClick={() => handleLike(comment.id, true)} className="flex items-center gap-1 hover:text-white">
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
                                            handleCopyLink(comment.id)
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
                                onSubmit={() => {
                                    console.log("Reply submitted:", replyContent)
                                    setReplyContent("")
                                    setReplyingTo(null)
                                }}
                                placeholder={`Balas ${comment.user}...`}
                                isLoggedIn={isLoggedIn}
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-800">
                            {comment.replies.map((reply: any) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    isLoggedIn={isLoggedIn}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    handleLike={handleLike}
                                    handleCopyLink={handleCopyLink}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function CommentsSection() {
    const [comments, setComments] = useState(INITIAL_COMMENTS)
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes">("newest")
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<number | null>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)

    // Mock Auth State
    const isLoggedIn = false // Change to true to test logged in state

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
            if (type === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
            if (type === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
            if (type === "likes") return b.likes - a.likes
            return 0
        })
        setComments(sorted)
    }

    const handleLike = (id: number, isDislike: boolean) => {
        console.log(`Liked/Disliked comment ${id}, dislike: ${isDislike}`)
    }

    const handleCopyLink = (id: number) => {
        navigator.clipboard.writeText(`${window.location.origin}/movie/1#comment-${id}`)
        alert("Link komentar disalin!")
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
                    onSubmit={() => {
                        console.log("Comment submitted:", newComment)
                        setNewComment("")
                    }}
                    placeholder={isLoggedIn ? "Tinggalkan komentar..." : "Silakan login terlebih dahulu"}
                    isLoggedIn={isLoggedIn}
                />
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        isLoggedIn={isLoggedIn}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        handleLike={handleLike}
                        handleCopyLink={handleCopyLink}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
                <button className="w-8 h-8 flex items-center justify-center bg-[#252525] text-gray-400 rounded hover:bg-primary hover:text-black transition-colors">{"<"}</button>
                <button className="w-8 h-8 flex items-center justify-center bg-primary text-black rounded font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#252525] text-gray-400 rounded hover:bg-primary hover:text-black transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#252525] text-gray-400 rounded hover:bg-primary hover:text-black transition-colors">3</button>
                <span className="flex items-end text-gray-500">...</span>
                <button className="w-8 h-8 flex items-center justify-center bg-[#252525] text-gray-400 rounded hover:bg-primary hover:text-black transition-colors">5</button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#252525] text-gray-400 rounded hover:bg-primary hover:text-black transition-colors">{">"}</button>
            </div>
        </div>
    )
}
