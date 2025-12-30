import SubmissionForm from "@/components/dashboard/SubmissionForm"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"

export default async function EditSubmission({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const { id } = await params

    const movie = await prisma.movie.findUnique({
        where: { id: Number(id) },
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

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Edit Film</h1>
                <p className="text-gray-400">Perbarui informasi film Anda.</p>
            </div>

            <SubmissionForm maxActors={10} initialData={movie} />
        </>
    )
}
