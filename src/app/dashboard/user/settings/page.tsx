import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { SettingsForm } from "./SettingsForm"

export default async function Settings() {
    const session = await auth()
    const user = await prisma.user.findUnique({
        where: { id: Number(session?.user?.id) }
    })

    if (!user) return null

    return (
        <>
            <h1 className="text-3xl font-bold text-white mb-8">Pengaturan</h1>
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8 max-w-2xl">
                <SettingsForm user={user} />
            </div>
        </>
    )
}
