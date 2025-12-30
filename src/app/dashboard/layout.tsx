import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { redirect } from "next/navigation"

export default async function RootDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/signin")
    }

    // Fetch user data once at root level
    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) }
    })

    return (
        <DashboardLayout user={user}>
            {children}
        </DashboardLayout>
    )
}
