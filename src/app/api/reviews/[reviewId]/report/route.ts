import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// POST /api/reviews/[reviewId]/report - Report a review
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number((session.user as any).id)
    const { reviewId } = await params
    const body = await request.json()
    const { reason } = body

    const reviewIdNum = Number(reviewId)

    if (!Number.isFinite(reviewIdNum)) {
        return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    if (!reason?.trim()) {
        return NextResponse.json({ error: "Reason is required" }, { status: 400 })
    }

    // Verify review exists
    const review = await prisma.review.findUnique({
        where: { id: reviewIdNum }
    })

    if (!review) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Can't report your own review
    if (review.userId === userId) {
        return NextResponse.json({ error: "Cannot report your own review" }, { status: 400 })
    }

    try {
        // Create or update report (upsert)
        await prisma.reviewReport.upsert({
            where: {
                reviewId_userId: {
                    reviewId: reviewIdNum,
                    userId
                }
            },
            update: {
                reason: reason.trim(),
                status: "pending"
            },
            create: {
                reviewId: reviewIdNum,
                userId,
                reason: reason.trim()
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error reporting review:", error)
        return NextResponse.json({ error: "Failed to report review" }, { status: 500 })
    }
}
