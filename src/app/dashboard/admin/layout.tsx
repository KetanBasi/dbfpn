import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/signin")
    }

    // Check admin role
    const userRole = (session.user as any).role
    if (userRole !== "admin") {
        notFound()
    }

    // Just pass children through - layout wrapper already applied by parent
    return <>{children}</>
}
