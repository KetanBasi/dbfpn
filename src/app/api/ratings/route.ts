import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { movieId, userId, rating, comment } = body

    const mId = Number(movieId)
    const uId = Number(userId)
    const r = Number(rating)

    const validIds = Number.isInteger(mId) && mId > 0 && Number.isInteger(uId) && uId > 0
    const validRating = Number.isFinite(r) && r >= 1 && r <= 5

    if (!validIds || !validRating) {
      return NextResponse.json(
        { error: "Invalid payload", detail: { movieId, userId, rating } },
        { status: 400 }
      )
    }

    const review = await prisma.review.upsert({
      where: { userId_movieId: { userId: uId, movieId: mId } },
      update: { rating: r, content: comment ?? null },
      create: { userId: uId, movieId: mId, rating: r, content: comment ?? null },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to submit review", detail: e?.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany()
    return NextResponse.json(reviews)
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch reviews", detail: e?.message },
      { status: 500 }
    )
  }
}
