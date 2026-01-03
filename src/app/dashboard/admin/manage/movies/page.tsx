import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Film, Search, Eye, Edit, Trash2, Archive, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Helper component
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
    const styles: Record<string, string> = {
        approved: "text-green-400 bg-green-500/10 border-green-500/20",
        pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        rejected: "text-red-400 bg-red-500/10 border-red-500/20",
        archived: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    }
    const labels: Record<string, string> = {
        approved: "Terbit",
        pending: "Pending",
        rejected: "Ditolak",
        archived: "Diarsipkan",
    }
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    )
}

export default async function ManageMoviesPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const session = await auth()
    const rawId = (session?.user as any)?.id
    const adminId = Number(rawId)

    if (!session || !Number.isFinite(adminId)) redirect("/signin")

    const me = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true }
    })

    if (!me || me.role !== "admin") redirect("/dashboard")

    const { q } = await searchParams
    const searchQuery = q?.trim() || ""

    // Only search if query provided
    const movies = searchQuery ? await prisma.movie.findMany({
        where: {
            OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { slug: { contains: searchQuery, mode: "insensitive" } },
            ]
        },
        include: {
            submitter: {
                select: { id: true, username: true, email: true }
            }
        },
        orderBy: { createdAt: "desc" },
        take: 50
    }) : []

    return (
        <>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Film size={22} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Kelola Film</h1>
                    <p className="text-gray-400 text-sm">Cari, edit, arsipkan, atau hapus film.</p>
                </div>
            </div>

            {/* Search Form */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-8">
                <form method="GET" className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Cari judul film..."
                            className="w-full bg-[#121212] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Results */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">
                        {searchQuery ? `Hasil Pencarian "${searchQuery}"` : "Hasil Pencarian"}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {searchQuery
                            ? `Ditemukan ${movies.length} film`
                            : "Masukkan kata kunci untuk mencari film"}
                    </p>
                </div>

                <div className="p-6">
                    {!searchQuery ? (
                        <div className="text-center py-12 text-gray-500">
                            <Search className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Gunakan form di atas untuk mencari film.</p>
                        </div>
                    ) : movies.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Film className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Tidak ada film yang cocok dengan pencarian.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {movies.map((movie) => {
                                const submitter = movie.submitter?.username || movie.submitter?.email?.split("@")[0] || "Unknown"
                                const isArchived = movie.status === "archived"

                                return (
                                    <div key={movie.id} className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex gap-4">
                                        {/* Movie Poster */}
                                        <div className="w-16 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
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
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                                <User size={14} />
                                                <span>Dikirim oleh @{submitter}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    href={`/movie/${movie.slug}`}
                                                    target="_blank"
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm"
                                                >
                                                    <Eye size={14} />
                                                    Lihat
                                                </Link>

                                                <Link
                                                    href={`/dashboard/submission/${movie.id}/edit`}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </Link>

                                                {!isArchived && (
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors text-sm"
                                                        title="Arsipkan film (unpublish)"
                                                    >
                                                        <Archive size={14} />
                                                        Arsipkan
                                                    </button>
                                                )}

                                                {isArchived && (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-600 cursor-not-allowed transition-colors"
                                                        title="Hapus tersedia 30 hari setelah diarsipkan"
                                                    >
                                                        <Trash2 size={14} />
                                                        Hapus (30 hari)
                                                    </button>
                                                )}
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
