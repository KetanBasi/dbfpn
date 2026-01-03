import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// POST /api/comments/[commentId]/report - Report a comment
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
    const { reason } = body

    const commentIdNum = Number(commentId)

    if (!Number.isFinite(commentIdNum)) {
        return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
    }

    if (!reason?.trim()) {
        return NextResponse.json({ error: "Reason is required" }, { status: 400 })
    }

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
        where: { id: commentIdNum }
    })

    if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Can't report your own comment
    if (comment.userId === userId) {
        return NextResponse.json({ error: "Cannot report your own comment" }, { status: 400 })
    }

    try {
        // Create or update report (upsert)
        await prisma.commentReport.upsert({
            where: {
                commentId_userId: {
                    commentId: commentIdNum,
                    userId
                }
            },
            update: {
                reason: reason.trim(),
                status: "pending"
            },
            create: {
                commentId: commentIdNum,
                userId,
                reason: reason.trim()
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error reporting comment:", error)
        return NextResponse.json({ error: "Failed to report comment" }, { status: 500 })
    }
}
