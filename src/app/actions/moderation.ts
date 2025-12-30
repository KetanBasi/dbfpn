"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Helper to verify admin access
async function verifyAdmin() {
    const session = await auth()
    const userId = Number((session?.user as any)?.id)

    if (!session || !Number.isFinite(userId)) {
        return { error: "Unauthorized", admin: null }
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true }
    })

    if (!user || user.role !== "admin") {
        return { error: "Forbidden", admin: null }
    }

    return { error: null, admin: user }
}

export async function approveMovie(movieId: number) {
    const { error, admin } = await verifyAdmin()
    if (error || !admin) {
        return { success: false, message: error || "Unauthorized" }
    }

    try {
        await prisma.movie.update({
            where: { id: movieId },
            data: { status: "approved" }
        })

        revalidatePath("/dashboard/admin/movies")
        revalidatePath("/top-100")
        return { success: true, message: "Film berhasil disetujui!" }
    } catch (e) {
        console.error("Error approving movie:", e)
        return { success: false, message: "Gagal menyetujui film." }
    }
}

export async function rejectMovie(movieId: number, reason: string) {
    const { error, admin } = await verifyAdmin()
    if (error || !admin) {
        return { success: false, message: error || "Unauthorized" }
    }

    if (!reason || reason.trim().length === 0) {
        return { success: false, message: "Alasan penolakan harus diisi." }
    }

    try {
        // Update movie status to rejected
        await prisma.movie.update({
            where: { id: movieId },
            data: { status: "rejected" }
        })

        // TODO: You could also store the rejection reason in a separate table or notification
        // For now, we'll just update the status

        revalidatePath("/dashboard/admin/movies")
        return { success: true, message: "Film berhasil ditolak." }
    } catch (e) {
        console.error("Error rejecting movie:", e)
        return { success: false, message: "Gagal menolak film." }
    }
}

export async function requestRevision(movieId: number, feedback: string) {
    const { error, admin } = await verifyAdmin()
    if (error || !admin) {
        return { success: false, message: error || "Unauthorized" }
    }

    if (!feedback || feedback.trim().length === 0) {
        return { success: false, message: "Detail revisi harus diisi." }
    }

    try {
        // Update movie status to revision
        await prisma.movie.update({
            where: { id: movieId },
            data: { status: "revision" }
        })

        // TODO: You could store revision feedback in notifications table

        revalidatePath("/dashboard/admin/movies")
        return { success: true, message: "Permintaan revisi berhasil dikirim." }
    } catch (e) {
        console.error("Error requesting revision:", e)
        return { success: false, message: "Gagal mengirim permintaan revisi." }
    }
}

export async function getPendingMovies() {
    const { error } = await verifyAdmin()
    if (error) {
        return { movies: [], error }
    }

    try {
        const movies = await prisma.movie.findMany({
            where: {
                status: { in: ["pending", "revision"] }
            },
            include: {
                submitter: {
                    select: { id: true, username: true, email: true }
                },
                people: {
                    where: { role: "director" },
                    include: { person: true },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return { movies, error: null }
    } catch (e) {
        console.error("Error fetching pending movies:", e)
        return { movies: [], error: "Failed to fetch movies" }
    }
}
