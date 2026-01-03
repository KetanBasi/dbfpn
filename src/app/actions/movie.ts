"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

interface ActorInput {
    name: string
    role: string
    userId?: number | null
}

interface MovieSubmissionData {
    id?: number
    title: string
    releaseDate?: string
    duration?: number
    synopsis: string
    posterUrl?: string
    bannerUrl?: string
    trailerUrl?: string
    videoUrl?: string
    director: string
    directorId?: number | null
    writer: string
    writerId?: number | null
    actors: ActorInput[]
}

export async function submitMovie(data: MovieSubmissionData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" }
    }

    try {
        // 1. Create or Find People (Director, Writer, Actors)
        // Helper function to handle person creation/finding
        const handlePerson = async (name: string, userId?: number | null) => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

            // If linked to a user, try to find by userId first
            if (userId) {
                const existingPerson = await prisma.person.findFirst({
                    where: { userId }
                })
                if (existingPerson) return existingPerson
            }

            // Otherwise find by slug
            let person = await prisma.person.findUnique({
                where: { slug }
            })

            if (!person) {
                person = await prisma.person.create({
                    data: {
                        name,
                        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
                        userId: userId || null
                    }
                })
            } else if (userId && !person.userId) {
                // If person exists but wasn't linked, and we now have a userId, update it
                person = await prisma.person.update({
                    where: { id: person.id },
                    data: { userId }
                })
            }

            return person
        }

        const directorPerson = await handlePerson(data.director, data.directorId)
        const writerPerson = await handlePerson(data.writer, data.writerId)

        // 2. Create or Update Movie
        if (data.id) {
            // Update existing movie
            const existingMovie = await prisma.movie.findUnique({
                where: { id: data.id }
            })

            if (!existingMovie) {
                return { success: false, message: "Film tidak ditemukan." }
            }

            if (existingMovie.submitterId !== Number(session.user.id) && session.user.role !== "admin") {
                return { success: false, message: "Anda tidak memiliki izin untuk mengedit film ini." }
            }

            // Delete existing people relations to recreate them (simplest way to handle updates)
            await prisma.moviePerson.deleteMany({
                where: { movieId: data.id }
            })

            await prisma.movie.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    synopsis: data.synopsis,
                    releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
                    duration: data.duration,
                    posterUrl: data.posterUrl,
                    bannerUrl: data.bannerUrl,
                    trailerUrl: data.trailerUrl,
                    videoUrl: data.videoUrl,
                    status: "pending", // Reset status to pending on edit? Usually yes.
                    people: {
                        create: [
                            {
                                personId: directorPerson.id,
                                role: "director"
                            },
                            {
                                personId: writerPerson.id,
                                role: "writer"
                            },
                            ...await Promise.all(data.actors.map(async (actor) => {
                                const person = await handlePerson(actor.name, actor.userId)
                                return {
                                    personId: person.id,
                                    role: "cast",
                                    characterName: actor.role
                                }
                            }))
                        ]
                    }
                }
            })

            revalidatePath("/dashboard/submissions")
            return { success: true, message: "Film berhasil diperbarui!" }

        } else {
            // Create new movie
            const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            const uniqueSlug = `${slug}-${Date.now()}`

            await prisma.movie.create({
                data: {
                    title: data.title,
                    slug: uniqueSlug,
                    synopsis: data.synopsis,
                    releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
                    duration: data.duration,
                    posterUrl: data.posterUrl,
                    bannerUrl: data.bannerUrl,
                    trailerUrl: data.trailerUrl,
                    videoUrl: data.videoUrl,
                    submitterId: Number(session.user.id),
                    status: "pending",
                    people: {
                        create: [
                            {
                                personId: directorPerson.id,
                                role: "director"
                            },
                            {
                                personId: writerPerson.id,
                                role: "writer"
                            },
                            ...await Promise.all(data.actors.map(async (actor) => {
                                const person = await handlePerson(actor.name, actor.userId)
                                return {
                                    personId: person.id,
                                    role: "cast",
                                    characterName: actor.role
                                }
                            }))
                        ]
                    }
                }
            })

            revalidatePath("/dashboard/submissions")
            return { success: true, message: "Film berhasil dikirim!" }
        }

    } catch (error) {
        console.error("Error submitting movie:", error)
        return { success: false, message: "Gagal mengirim film." }
    }
}
