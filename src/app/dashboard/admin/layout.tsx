import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/signin")
    }

    if (session.user.role !== "admin") {
        notFound()
    }

    return <>{children}</>
}
