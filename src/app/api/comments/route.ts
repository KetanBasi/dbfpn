import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// GET /api/comments?movieId=X - Fetch comments for a movie
export async function GET(request: NextRequest) {
    const movieId = request.nextUrl.searchParams.get("movieId")

    if (!movieId) {
        return NextResponse.json({ error: "movieId is required" }, { status: 400 })
    }

    const session = await auth()
    const currentUserId = session?.user ? Number((session.user as any).id) : null

    // Fetch top-level comments with their replies
    const comments = await prisma.comment.findMany({
        where: {
            movieId: Number(movieId),
            parentId: null, // Only top-level comments
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                    role: true,
                    isVerified: true,
                }
            },
            votes: true,
            replies: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatarUrl: true,
                            role: true,
                            isVerified: true,
                        }
                    },
                    votes: true,
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    name: true,
                                    avatarUrl: true,
                                    role: true,
                                    isVerified: true,
                                }
                            },
                            votes: true,
                        },
                        orderBy: { createdAt: "asc" }
                    }
                },
                orderBy: { createdAt: "asc" }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    // Transform comments to include like/dislike counts and user's vote
    const transformComment = (comment: any): any => {
        const likes = comment.votes.filter((v: any) => !v.isDislike).length
        const dislikes = comment.votes.filter((v: any) => v.isDislike).length
        const userVote = currentUserId
            ? comment.votes.find((v: any) => v.userId === currentUserId)
            : null

        return {
            id: comment.id,
            content: comment.deletedAt ? "[Komentar ini telah dihapus]" : comment.content,
            createdAt: comment.createdAt,
            deletedAt: comment.deletedAt,
            isOwner: currentUserId === comment.user.id,
            user: {
                id: comment.user.id,
                username: comment.user.username,
                name: comment.user.name,
                avatarUrl: comment.user.avatarUrl,
                isAdmin: comment.user.role === "admin",
                isVerified: comment.user.isVerified,
            },
            likes,
            dislikes,
            userVote: userVote ? (userVote.isDislike ? "dislike" : "like") : null,
            replies: comment.replies?.map(transformComment) || []
        }
    }

    const transformedComments = comments.map(transformComment)

    return NextResponse.json({
        comments: transformedComments,
        total: comments.length
    })
}

// POST /api/comments - Create a new comment or reply
export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number((session.user as any).id)
    const body = await request.json()
    const { movieId, content, parentId } = body

    if (!movieId || !content?.trim()) {
        return NextResponse.json({ error: "movieId and content are required" }, { status: 400 })
    }

    // Verify movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: Number(movieId) }
    })

    if (!movie) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
        const parentComment = await prisma.comment.findUnique({
            where: { id: Number(parentId) }
        })
        if (!parentComment) {
            return NextResponse.json({ error: "Parent comment not found" }, { status: 404 })
        }
    }

    const comment = await prisma.comment.create({
        data: {
            userId,
            movieId: Number(movieId),
            content: content.trim(),
            parentId: parentId ? Number(parentId) : null,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                    role: true,
                }
            }
        }
    })

    return NextResponse.json({
        success: true,
        comment: {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            deletedAt: null,
            isOwner: true,
            user: {
                id: comment.user.id,
                username: comment.user.username,
                name: comment.user.name,
                avatarUrl: comment.user.avatarUrl,
                isAdmin: comment.user.role === "admin",
            },
            likes: 0,
            dislikes: 0,
            userVote: null,
            replies: []
        }
    })
}

// DELETE /api/comments - Soft delete a comment
export async function DELETE(request: NextRequest) {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number((session.user as any).id)
    const userRole = (session.user as any).role
    const body = await request.json()
    const { commentId } = body

    if (!commentId) {
        return NextResponse.json({ error: "commentId is required" }, { status: 400 })
    }

    const comment = await prisma.comment.findUnique({
        where: { id: Number(commentId) }
    })

    if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Only owner or admin can delete
    if (comment.userId !== userId && userRole !== "admin") {
        return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 })
    }

    // Soft delete - set deletedAt timestamp
    await prisma.comment.update({
        where: { id: Number(commentId) },
        data: { deletedAt: new Date() }
    })

    return NextResponse.json({ success: true })
}
