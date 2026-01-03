import SubmissionForm from "@/components/dashboard/SubmissionForm"
import { getConfig } from "@/lib/config"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function MovieSubmission() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/signin")
    }

    const userId = Number((session.user as any).id)

    // Check if user is verified (required for movie submission)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerified: true, role: true }
    })

    const isVerified = user?.isVerified || user?.role === "admin"

    // Redirect non-verified users to upgrade page
    if (!isVerified) {
        redirect("/dashboard/user/upgrade")
    }

    const config = getConfig()

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Kirim Film</h1>
            <p className="text-gray-400 mb-8">Berkontribusi pada database dengan mengirimkan film baru. Semua kiriman memerlukan persetujuan admin.</p>

            <SubmissionForm maxActors={config.max_actors} />
        </div>
    )
}
