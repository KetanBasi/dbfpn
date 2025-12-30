import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const name = formData.get("name") as string
        const username = formData.get("username") as string

        if (!name || !username) {
            return NextResponse.json({ error: "Name and username are required" }, { status: 400 })
        }

        // Check if username is taken
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser && existingUser.id !== Number(session.user.id)) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 })
        }

        // Update user profile
        await prisma.user.update({
            where: { id: Number(session.user.id) },
            data: {
                name,
                username,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error completing profile:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
