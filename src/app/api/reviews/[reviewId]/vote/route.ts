import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// POST /api/reviews/[reviewId]/vote - Agree or disagree on a review
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
    const { isAgree } = body // true = agree, false = disagree

    const reviewIdNum = Number(reviewId)

    if (!Number.isFinite(reviewIdNum)) {
        return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Verify review exists
    const review = await prisma.review.findUnique({
        where: { id: reviewIdNum }
    })

    if (!review) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Can't vote on your own review
    if (review.userId === userId) {
        return NextResponse.json({ error: "Cannot vote on your own review" }, { status: 400 })
    }

    // Check for existing vote
    const existingVote = await prisma.reviewVote.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId: reviewIdNum
            }
        }
    })

    let action: "created" | "updated" | "removed"

    if (existingVote) {
        // If same vote type, remove the vote (toggle off)
        if (existingVote.isAgree === isAgree) {
            await prisma.reviewVote.delete({
                where: {
                    userId_reviewId: {
                        userId,
                        reviewId: reviewIdNum
                    }
                }
            })
            action = "removed"
        } else {
            // Different vote type, update it
            await prisma.reviewVote.update({
                where: {
                    userId_reviewId: {
                        userId,
                        reviewId: reviewIdNum
                    }
                },
                data: { isAgree }
            })
            action = "updated"
        }
    } else {
        // Create new vote
        await prisma.reviewVote.create({
            data: {
                userId,
                reviewId: reviewIdNum,
                isAgree: !!isAgree
            }
        })
        action = "created"
    }

    // Get updated vote counts
    const [agrees, disagrees] = await Promise.all([
        prisma.reviewVote.count({
            where: { reviewId: reviewIdNum, isAgree: true }
        }),
        prisma.reviewVote.count({
            where: { reviewId: reviewIdNum, isAgree: false }
        })
    ])

    // Get user's current vote
    const userVote = await prisma.reviewVote.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId: reviewIdNum
            }
        }
    })

    return NextResponse.json({
        success: true,
        action,
        agrees,
        disagrees,
        userVote: userVote ? (userVote.isAgree ? "agree" : "disagree") : null
    })
}
