import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

type Body = {
  targetType?: "user" | "movie" | "comment" | "review"
  targetId?: number
  reason?: string
  targetUserId?: number // kompatibel field lama
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const reporterIdRaw = (session?.user as any)?.id
    const reporterId = Number(reporterIdRaw)

    if (!session || !Number.isFinite(reporterId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as Body | null
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const targetType = body.targetType ?? "user"
    const targetId = Number(body.targetId ?? body.targetUserId)
    const reason = String(body.reason ?? "").trim()

    if (!targetType) {
      return NextResponse.json({ error: "targetType wajib" }, { status: 400 })
    }
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return NextResponse.json({ error: "targetId tidak valid" }, { status: 400 })
    }
    if (!reason) {
      return NextResponse.json({ error: "reason wajib diisi" }, { status: 400 })
    }
    if (reason.length > 200) {
      return NextResponse.json({ error: "reason kepanjangan (max 200)" }, { status: 400 })
    }

    if (targetType === "user") {
      if (reporterId === targetId) {
        return NextResponse.json({ error: "Tidak bisa melaporkan akun sendiri" }, { status: 400 })
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetId },
        select: { id: true },
      })

      if (!targetUser) {
        return NextResponse.json({ error: "Target user tidak ditemukan" }, { status: 404 })
      }
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
        status: "pending",
      },
      select: { id: true, createdAt: true },
    })

    return NextResponse.json({ ok: true, report }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
