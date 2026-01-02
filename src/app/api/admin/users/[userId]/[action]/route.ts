import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

async function checkAdmin() {
    const session = await auth()
    const rawId = (session?.user as any)?.id
    const adminId = Number(rawId)

    if (!session || !Number.isFinite(adminId)) {
        return { error: "Unauthorized", status: 401 }
    }

    const admin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true }
    })

    if (!admin || admin.role !== "admin") {
        return { error: "Forbidden", status: 403 }
    }

    return { adminId }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; action: string }> }
) {
    const check = await checkAdmin()
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status })
    }

    const { userId, action } = await params
    const targetId = Number(userId)

    if (!Number.isFinite(targetId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Don't allow actions on admins
    const target = await prisma.user.findUnique({
        where: { id: targetId },
        select: { role: true, status: true }
    })

    if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (target.role === "admin") {
        return NextResponse.json({ error: "Cannot modify admin users" }, { status: 403 })
    }

    let newStatus: string

    switch (action) {
        case "ban":
            newStatus = "banned"
            break
        case "unban":
            newStatus = "active"
            break
        case "activate":
            newStatus = "active"
            break
        case "deactivate":
            newStatus = "inactive"
            break
        default:
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await prisma.user.update({
        where: { id: targetId },
        data: { status: newStatus }
    })

    return NextResponse.json({ success: true, status: newStatus })
}
