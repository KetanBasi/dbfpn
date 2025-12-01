import DashboardLayout from "@/components/dashboard/DashboardLayout"
import ModerationContent from "./ModerationContent"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export default async function AdminModeration() {
    const session = await auth()
    const user = await prisma.user.findUnique({
        where: { id: Number(session?.user?.id) }
    })

    return (
        <DashboardLayout user={user}>
            <ModerationContent />
        </DashboardLayout>
    )
}
