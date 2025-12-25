"use client"

import { useMemo, useState } from "react"
import { Flag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import ReportUserModal from "./ReportUserModal"

type Props = {
  targetUserId: number
  targetUsername?: string | null
}

export default function ReportUserButton({ targetUserId, targetUsername }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const viewerId = useMemo(() => {
    const raw = (session?.user as any)?.id
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  }, [session])

  if (status === "loading") return null
  if (viewerId && viewerId === targetUserId) return null

  const handleOpen = () => {
    if (status !== "authenticated" || !viewerId) {
      router.push("/signin")
      return
    }
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#333] text-white border border-gray-700 flex items-center gap-2"
        aria-label="Laporkan pengguna"
        title="Laporkan pengguna"
      >
        <Flag size={16} />
        Laporkan
      </button>

      <ReportUserModal
        open={open}
        onClose={() => setOpen(false)}
        targetUserId={targetUserId}
        targetUsername={targetUsername ?? ""}
      />
    </>
  )
}
