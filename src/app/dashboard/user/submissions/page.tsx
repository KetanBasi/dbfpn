import Link from "next/link"
import { Upload, Edit, Clock, CheckCircle, XCircle, AlertCircle, Sparkles } from "lucide-react"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Image from "next/image"
import { redirect } from "next/navigation"

// Helper component to display movie image with fallback
function MovieImage({ movie }: { movie: { posterUrl: string | null, bannerUrl: string | null, title: string } }) {
    // Priority: poster > banner > placeholder
    if (movie.posterUrl) {
        return <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
    }
    if (movie.bannerUrl) {
        return <Image src={movie.bannerUrl} alt={movie.title} fill className="object-cover" />
    }
    // Generate placeholder based on movie title initials
    const initials = movie.title
        .split(' ')
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('')

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-300 text-lg font-bold">
            {initials || 'M'}
        </div>
    )
}

export default async function MySubmissions() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/signin")
    }

    const userId = Number(session.user.id)

    // Check if user is verified
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerified: true, role: true }
    })

    const isVerified = user?.isVerified || user?.role === "admin"

    // Redirect non-verified users to upgrade page
    if (!isVerified) {
        redirect("/dashboard/user/upgrade")
    }

    const submissions = await prisma.movie.findMany({
        where: { submitterId: userId },
        orderBy: { updatedAt: 'desc' }
    })

    const pendingSubmissions = submissions.filter(m => m.status === 'pending' || m.status === 'rejected' || m.status === 'revision')
    const approvedSubmissions = submissions.filter(m => m.status === 'approved')

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending':
                return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs font-bold"><Clock size={12} /> Menunggu</span>
            case 'approved':
                return <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={12} /> Disetujui</span>
            case 'rejected':
                return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs font-bold"><XCircle size={12} /> Ditolak</span>
            case 'revision':
                return <span className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-1 rounded text-xs font-bold"><AlertCircle size={12} /> Perlu Revisi</span>
            default:
                return null
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Kiriman Saya</h1>
                <Link
                    href="/dashboard/submission"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600 transition-all text-sm shadow-lg shadow-yellow-500/20 group"
                >
                    <Sparkles size={16} className="group-hover:animate-pulse" />
                    <span>Kirim Film Baru</span>
                    <span className="animate-pulse">✨</span>
                </Link>
            </div>

            <div className="space-y-8">
                {/* Pending / Revision */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="text-yellow-500" /> Menunggu Moderasi / Revisi
                    </h2>
                    {pendingSubmissions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {pendingSubmissions.map(movie => (
                                <div key={movie.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                                    <div className="w-16 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                        <MovieImage movie={movie} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{movie.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StatusBadge status={movie.status} />
                                                    <span className="text-gray-500 text-xs">{new Date(movie.updatedAt || movie.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dashboard/submission/${movie.id}/edit`}
                                                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-primary hover:text-black transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Tidak ada film yang sedang menunggu moderasi.</p>
                    )}
                </div>

                {/* Approved */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-500" /> Disetujui (Publik)
                    </h2>
                    {approvedSubmissions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {approvedSubmissions.map(movie => (
                                <div key={movie.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex gap-4 items-center opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                        <MovieImage movie={movie} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link href={`/movie/${movie.slug}`} className="font-bold text-white text-lg hover:text-primary transition-colors">
                                                    {movie.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StatusBadge status={movie.status} />
                                                    <span className="text-gray-500 text-xs">{new Date(movie.releaseDate || movie.createdAt).getFullYear()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dashboard/submission/${movie.id}/edit`}
                                                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-primary hover:text-black transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Belum ada film yang disetujui.</p>
                    )}
                </div>
            </div>
        </>
    )
}
