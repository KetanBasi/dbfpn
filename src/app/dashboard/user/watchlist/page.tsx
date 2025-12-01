import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export default async function Watchlist() {
    const session = await auth()
    const user = await prisma.user.findUnique({
        where: { id: Number(session?.user?.id) }
    })

    return (
        <DashboardLayout user={user}>
            <h1 className="text-3xl font-bold text-white mb-8">Tonton Nanti</h1>
            <div className="text-center text-gray-500 py-12 bg-[#1a1a1a] rounded-xl border border-gray-800">
                Belum ada film di daftar tonton nanti.
            </div>
        </DashboardLayout>
    )
}
