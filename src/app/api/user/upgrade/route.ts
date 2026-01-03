import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// POST /api/user/upgrade - Dummy upgrade to set isVerified = true
export async function POST() {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number((session.user as any).id)

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error upgrading user:", error)
        return NextResponse.json({ error: "Failed to upgrade" }, { status: 500 })
    }
}
