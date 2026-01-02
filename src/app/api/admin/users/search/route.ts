import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    const session = await auth()
    const rawId = (session?.user as any)?.id
    const adminId = Number(rawId)

    if (!session || !Number.isFinite(adminId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true }
    })

    if (!admin || admin.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const q = request.nextUrl.searchParams.get("q")?.trim()
    if (!q) {
        return NextResponse.json({ users: [] })
    }

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
            ]
        },
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
            status: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50
    })

    return NextResponse.json({ users })
}
