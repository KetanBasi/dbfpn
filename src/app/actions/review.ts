"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitReview(movieId: number, rating: number, content: string) {
    const session = await auth()

    if (!session || !session.user || !session.user.email) {
        return { error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        return { error: "User not found" }
    }

    try {
        await prisma.review.upsert({
            where: {
                userId_movieId: {
                    userId: user.id,
                    movieId: movieId,
                },
            },
            update: {
                rating,
                content,
            },
            create: {
                userId: user.id,
                movieId: movieId,
                rating,
                content,
            },
        })

        // Revalidate the movie page to show the new review/rating
        // We need to fetch the movie slug to revalidate the correct path
        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
            select: { slug: true },
        })

        if (movie) {
            revalidatePath(`/movie/${movie.slug}`)
        }

        revalidatePath(`/user/${user.username}`)
        revalidatePath(`/dashboard`)

        return { success: true }
    } catch (error) {
        console.error("Error submitting review:", error)
        return { error: "Failed to submit review" }
    }
}
