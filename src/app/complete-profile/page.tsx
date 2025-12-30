import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import CompleteProfileForm from "./CompleteProfileForm"

export default async function CompleteProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl?: string }>
}) {
    const session = await auth()
    const { callbackUrl } = await searchParams

    // Redirect to signin if not authenticated
    if (!session?.user) {
        redirect("/signin")
    }

    // Check if profile is already complete
    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        select: { username: true, name: true },
    })

    if (user?.username && user?.name) {
        // Profile already complete, redirect to callback or dashboard
        redirect(callbackUrl || "/dashboard")
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
            <div className="bg-[#252525] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Lengkapi Profil Anda</h1>
                    <p className="text-gray-400 text-sm">
                        Satu langkah lagi! Isi informasi di bawah untuk menyelesaikan pendaftaran.
                    </p>
                </div>

                <CompleteProfileForm
                    callbackUrl={callbackUrl || "/dashboard"}
                    initialData={{
                        name: user?.name || "",
                        username: user?.username || "",
                    }}
                />
            </div>
        </div>
    )
}
