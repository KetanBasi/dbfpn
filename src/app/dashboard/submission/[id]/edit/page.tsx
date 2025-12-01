import DashboardLayout from "@/components/dashboard/DashboardLayout"
import SubmissionForm from "@/components/dashboard/SubmissionForm"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"

export default async function EditSubmission({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const movie = await prisma.movie.findUnique({
        where: { id: Number(params.id) },
        include: {
            people: {
                include: {
                    person: true
                }
            }
        }
    })

    if (!movie) {
        notFound()
    }

    // Check ownership or admin
    if (movie.submitterId !== Number(session.user.id) && session.user.role !== "admin") {
        redirect("/dashboard/user/submissions")
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) }
    })

    return (
        <DashboardLayout user={user}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Edit Film</h1>
                <p className="text-gray-400">Perbarui informasi film Anda.</p>
            </div>

            <SubmissionForm maxActors={10} initialData={movie} />
        </DashboardLayout>
    )
}
