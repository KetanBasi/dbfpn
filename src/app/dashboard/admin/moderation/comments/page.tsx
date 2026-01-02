import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { MessageSquare, Clock } from "lucide-react"

export default async function CommentModerationPage() {
    const session = await auth()
    const rawId = (session?.user as any)?.id
    const adminId = Number(rawId)

    if (!session || !Number.isFinite(adminId)) redirect("/signin")

    const me = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true }
    })

    if (!me || me.role !== "admin") redirect("/dashboard/user")

    return (
        <>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <MessageSquare size={22} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Moderasi Komentar</h1>
                    <p className="text-gray-400 text-sm">Review dan moderasi komentar yang dilaporkan.</p>
                </div>
            </div>

            {/* Stats Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <Clock size={18} />
                        </div>
                        <div className="text-2xl font-bold text-white">0</div>
                    </div>
                    <div className="text-gray-400 text-sm">Komentar Pending</div>
                </div>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                            <MessageSquare size={18} />
                        </div>
                        <div className="text-2xl font-bold text-white">0</div>
                    </div>
                    <div className="text-gray-400 text-sm">Komentar Dilaporkan</div>
                </div>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                            <MessageSquare size={18} />
                        </div>
                        <div className="text-2xl font-bold text-white">0</div>
                    </div>
                    <div className="text-gray-400 text-sm">Komentar Dimoderasi</div>
                </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
                <MessageSquare className="mx-auto mb-4 text-gray-600" size={48} />
                <h2 className="text-xl font-bold text-white mb-2">Segera Hadir</h2>
                <p className="text-gray-400">
                    Fitur moderasi komentar sedang dalam pengembangan.
                </p>
            </div>
        </>
    )
}
