import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const userId = Number((session.user as any).id)
        if (!Number.isFinite(userId)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { username, name } = body

        // Validate username
        if (!username || typeof username !== "string") {
            return NextResponse.json(
                { error: "Username wajib diisi" },
                { status: 400 }
            )
        }

        const trimmedUsername = username.trim().toLowerCase()

        if (trimmedUsername.length < 3) {
            return NextResponse.json(
                { error: "Username minimal 3 karakter" },
                { status: 400 }
            )
        }

        if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
            return NextResponse.json(
                { error: "Username hanya boleh huruf kecil, angka, dan underscore" },
                { status: 400 }
            )
        }

        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
            where: { username: trimmedUsername },
        })

        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json(
                { error: "Username sudah digunakan" },
                { status: 409 }
            )
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: trimmedUsername,
                name: name?.trim() || null,
            },
        })

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                name: updatedUser.name,
            },
        })
    } catch (error) {
        console.error("Error completing profile:", error)
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        )
    }
}
