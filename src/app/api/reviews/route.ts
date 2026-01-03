// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth" // SESUAIKAN: lihat poin di bawah
import { query } from "@/lib/db"

// POST /api/reviews
// Body: { movieId: number, rating: 1-5, content?: string }
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const movieId = Number(body.movieId)
  const rating = Number(body.rating)
  const content = body.content ?? null

  if (!movieId || Number.isNaN(movieId)) {
    return NextResponse.json(
      { message: "movieId wajib ada" },
      { status: 400 }
    )
  }

  // 1–5 saja
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { message: "rating harus antara 1 sampai 5" },
      { status: 400 }
    )
  }

  try {
    const userId = Number(session.user.id)

    // Upsert: kalau user sudah pernah review, update
    const result = await query(
      `
      INSERT INTO reviews (user_id, movie_id, rating, content)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET
        rating = EXCLUDED.rating,
        content = EXCLUDED.content,
        updated_at = now()
      RETURNING *;
    `,
      [userId, movieId, rating, content]
    )

    const statsResult = await query<{
      count: number
      avg_rating: number
    }>(
      `
      SELECT
        COUNT(*)::int AS count,
        COALESCE(AVG(rating), 0)::float AS avg_rating
      FROM reviews
      WHERE movie_id = $1;
    `,
      [movieId]
    )

    return NextResponse.json({
      review: result.rows[0],
      stats: statsResult.rows[0],
    })
  } catch (err) {
    console.error("Error POST /api/reviews", err)
    return NextResponse.json(
      { message: "Gagal menyimpan rating" },
      { status: 500 }
    )
  }
}

// GET /api/reviews?movieId=123
export async function GET(req: NextRequest) {
  const session = await auth()
  const url = new URL(req.url)
  const movieIdParam = url.searchParams.get("movieId")
  const movieId = movieIdParam ? Number(movieIdParam) : NaN

  if (!movieId || Number.isNaN(movieId)) {
    return NextResponse.json(
      { message: "movieId query wajib ada" },
      { status: 400 }
    )
  }

  try {
    const userId = session?.user?.id ? Number(session.user.id) : null

    // Fetch reviews with votes using Prisma
    const reviews = await (await import("@/lib/prisma")).default.review.findMany({
      where: { movieId },
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
      orderBy: { createdAt: "desc" }
    })

    // Transform reviews to include vote counts
    const transformedReviews = reviews.map((review: any) => {
      const agrees = review.votes.filter((v: any) => v.isAgree).length
      const disagrees = review.votes.filter((v: any) => !v.isAgree).length
      const userVote = userId
        ? review.votes.find((v: any) => v.userId === userId)
        : null

      return {
        id: review.id,
        user_id: review.userId,
        movie_id: review.movieId,
        rating: review.rating,
        content: review.content,
        created_at: review.createdAt,
        updated_at: review.updatedAt,
        name: review.user.name,
        username: review.user.username,
        avatar_url: review.user.avatarUrl,
        isAdmin: review.user.role === "admin",
        isVerified: review.user.isVerified,
        isOwner: review.userId === userId,
        agrees,
        disagrees,
        userVote: userVote ? (userVote.isAgree ? "agree" : "disagree") : null,
      }
    })

    // Get stats
    const stats = {
      count: reviews.length,
      avg_rating: reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0
    }

    // Get user's review
    const userReview = userId ? reviews.find(r => r.userId === userId) : null

    return NextResponse.json({
      reviews: transformedReviews,
      stats,
      userReview: userReview ? {
        id: userReview.id,
        rating: userReview.rating,
        content: userReview.content,
      } : null,
    })
  } catch (err) {
    console.error("Error GET /api/reviews", err)
    return NextResponse.json(
      { message: "Gagal mengambil rating" },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews - Delete a review
export async function DELETE(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.user.id)
  const userRole = (session.user as any).role
  const body = await req.json()
  const { reviewId, movieId } = body

  // Support both reviewId and movieId for deletion
  if (!reviewId && !movieId) {
    return NextResponse.json({ error: "reviewId or movieId is required" }, { status: 400 })
  }

  try {
    const prisma = (await import("@/lib/prisma")).default

    let review
    if (reviewId) {
      review = await prisma.review.findUnique({
        where: { id: Number(reviewId) }
      })
    } else {
      review = await prisma.review.findUnique({
        where: {
          userId_movieId: {
            userId,
            movieId: Number(movieId)
          }
        }
      })
    }

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Only owner or admin can delete
    if (review.userId !== userId && userRole !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await prisma.review.delete({
      where: { id: review.id }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error DELETE /api/reviews", err)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
