import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// POST /api/comments/[commentId]/vote - Like or dislike a comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number((session.user as any).id)
    const { commentId } = await params
    const body = await request.json()
    const { isDislike } = body // true = dislike, false = like

    const commentIdNum = Number(commentId)

    if (!Number.isFinite(commentIdNum)) {
        return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
    }

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
        where: { id: commentIdNum }
    })

    if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check for existing vote
    const existingVote = await prisma.commentVote.findUnique({
        where: {
            userId_commentId: {
                userId,
                commentId: commentIdNum
            }
        }
    })

    let action: "created" | "updated" | "removed"

    if (existingVote) {
        // If same vote type, remove the vote (toggle off)
        if (existingVote.isDislike === isDislike) {
            await prisma.commentVote.delete({
                where: {
                    userId_commentId: {
                        userId,
                        commentId: commentIdNum
                    }
                }
            })
            action = "removed"
        } else {
            // Different vote type, update it
            await prisma.commentVote.update({
                where: {
                    userId_commentId: {
                        userId,
                        commentId: commentIdNum
                    }
                },
                data: { isDislike }
            })
            action = "updated"
        }
    } else {
        // Create new vote
        await prisma.commentVote.create({
            data: {
                userId,
                commentId: commentIdNum,
                isDislike: !!isDislike
            }
        })
        action = "created"
    }

    // Get updated vote counts
    const [likes, dislikes] = await Promise.all([
        prisma.commentVote.count({
            where: { commentId: commentIdNum, isDislike: false }
        }),
        prisma.commentVote.count({
            where: { commentId: commentIdNum, isDislike: true }
        })
    ])

    // Get user's current vote
    const userVote = await prisma.commentVote.findUnique({
        where: {
            userId_commentId: {
                userId,
                commentId: commentIdNum
            }
        }
    })

    return NextResponse.json({
        success: true,
        action,
        likes,
        dislikes,
        userVote: userVote ? (userVote.isDislike ? "dislike" : "like") : null
    })
}
