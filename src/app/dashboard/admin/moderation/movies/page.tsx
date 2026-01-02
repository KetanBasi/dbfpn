import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Film, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react"
import MovieModerationActions from "@/components/admin/MovieModerationActions"

// Helper component to display movie image with fallback
function MovieImage({ movie }: { movie: { posterUrl: string | null, bannerUrl: string | null, title: string } }) {
    if (movie.posterUrl) {
        return <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
    }
    if (movie.bannerUrl) {
        return <Image src={movie.bannerUrl} alt={movie.title} fill className="object-cover" />
    }
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

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'pending':
            return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs font-bold"><Clock size={12} /> Menunggu</span>
        case 'approved':
            return <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={12} /> Disetujui</span>
        case 'rejected':
            return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs font-bold"><XCircle size={12} /> Ditolak</span>
        case 'revision':
            return <span className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-1 rounded text-xs font-bold"><AlertCircle size={12} /> Revisi</span>
        default:
            return null
    }
}

export default async function AdminMovies() {
    const session = await auth()
    const rawId = (session?.user as any)?.id
    const adminId = Number(rawId)

    if (!session || !Number.isFinite(adminId)) redirect("/signin")

    const me = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true }
    })

    if (!me || me.role !== "admin") redirect("/dashboard/user")

    // Fetch movies awaiting moderation (pending and revision)
    const pendingMovies = await prisma.movie.findMany({
        where: {
            status: { in: ["pending", "revision"] }
        },
        include: {
            submitter: {
                select: { id: true, username: true, email: true }
            },
            people: {
                where: { role: "director" },
                include: { person: true },
                take: 1
            }
        },
        orderBy: { createdAt: "desc" }
    })

    // Stats
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
        prisma.movie.count({ where: { status: { in: ["pending", "revision"] } } }),
        prisma.movie.count({ where: { status: "approved" } }),
        prisma.movie.count({ where: { status: "rejected" } })
    ])

    return (
        <>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Film size={22} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Moderasi Film</h1>
                    <p className="text-gray-400 text-sm">Review dan setujui kiriman film dari pengguna.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <Clock size={18} />
                        </div>
                        <div className="text-2xl font-bold text-white">{pendingCount}</div>
                    </div>
                    <div className="text-gray-400 text-sm">Menunggu Moderasi</div>
                </div>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                            <CheckCircle size={18} />
                        </div>
                        <div className="text-2xl font-bold text-white">{approvedCount}</div>
                    </div>
                    <div className="text-gray-400 text-sm">Disetujui</div>
                </div>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                            <XCircle size={18} />
                        </div>
                        <div className="text-2xl font-bold text-white">{rejectedCount}</div>
                    </div>
                    <div className="text-gray-400 text-sm">Ditolak</div>
                </div>
            </div>

            {/* Pending Submissions */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">Kiriman Menunggu Review</h2>
                    <p className="text-gray-400 text-sm mt-1">Film yang perlu direview dan disetujui oleh admin.</p>
                </div>

                <div className="p-6">
                    {pendingMovies.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Film className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Tidak ada kiriman film yang menunggu moderasi.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingMovies.map((movie) => {
                                const director = movie.people[0]?.person?.name || "Unknown"
                                const submitter = movie.submitter?.username || movie.submitter?.email?.split("@")[0] || "Unknown"

                                return (
                                    <div key={movie.id} className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex gap-4">
                                        {/* Movie Image */}
                                        <div className="w-20 h-28 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                            <MovieImage movie={movie} />
                                        </div>

                                        {/* Movie Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <h3 className="font-bold text-white text-lg line-clamp-1">{movie.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <StatusBadge status={movie.status} />
                                                        <span className="text-gray-500 text-xs">
                                                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "TBA"}
                                                        </span>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="text-gray-500 text-xs">oleh @{submitter}</span>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/movie/${movie.slug}`}
                                                    target="_blank"
                                                    className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors flex-shrink-0"
                                                    title="Preview Film"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </div>

                                            <div className="text-gray-400 text-sm mb-3">
                                                <span className="text-gray-500">Sutradara:</span> {director}
                                            </div>

                                            {movie.synopsis && (
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                                    {movie.synopsis}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 text-xs">
                                                    Dikirim {new Date(movie.createdAt).toLocaleDateString("id-ID", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </span>

                                                <MovieModerationActions
                                                    movieId={movie.id}
                                                    movieTitle={movie.title}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
