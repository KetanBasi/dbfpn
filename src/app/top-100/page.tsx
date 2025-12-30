import { Star, Filter } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import Image from "next/image"

// Force dynamic rendering to avoid database connection exhaustion during build
export const dynamic = "force-dynamic"

export default async function Top100() {
    // Fetch approved movies with their reviews to calculate average rating
    const movies = await prisma.movie.findMany({
        where: { status: "approved" },
        include: {
            reviews: {
                select: { rating: true }
            },
            people: {
                where: { role: "director" },
                include: { person: true },
                take: 1
            }
        }
    })

    // Calculate average rating and sort by it
    const moviesWithRating = movies.map(movie => {
        const avgRating = movie.reviews.length > 0
            ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length
            : 0
        return {
            ...movie,
            avgRating,
            director: movie.people[0]?.person?.name || "Unknown"
        }
    }).sort((a, b) => b.avgRating - a.avgRating).slice(0, 100)

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col">
            <main className="flex-grow pt-8 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Top 100 Film</h1>
                            <p className="text-gray-400">Film dengan rating tertinggi sepanjang masa berdasarkan penilaian komunitas.</p>
                        </div>

                        <div className="relative">
                            <select className="bg-[#1a1a1a] border border-gray-800 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer min-w-[200px]">
                                <option value="">Semua Genre</option>
                                <option value="action">Action</option>
                                <option value="drama">Drama</option>
                                <option value="scifi">Sci-Fi</option>
                            </select>
                            <Filter className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {moviesWithRating.length > 0 ? (
                            moviesWithRating.map((movie, index) => (
                                <Link href={`/movie/${movie.slug}`} key={movie.id} className="bg-[#1a1a1a] rounded-xl p-4 flex gap-6 hover:bg-[#252525] transition-colors group cursor-pointer border border-transparent hover:border-gray-800">
                                    <div className="text-4xl font-bold text-gray-700 w-16 flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                                        {index + 1}
                                    </div>
                                    <div className="w-24 h-36 bg-gray-800 rounded-lg overflow-hidden relative shrink-0">
                                        {movie.posterUrl ? (
                                            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Poster</div>
                                        )}
                                    </div>
                                    <div className="flex-1 py-2">
                                        <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{movie.title}</h2>
                                        <div className="text-gray-400 mb-4">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "TBA"} • {movie.director}</div>
                                        <div className="flex items-center gap-2">
                                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                                            <span className="text-xl font-bold text-white">{movie.avgRating.toFixed(1)}</span>
                                            <span className="text-sm text-gray-500">/ 5</span>
                                            <span className="text-xs text-gray-600 ml-2">({movie.reviews.length} ulasan)</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                <p className="text-xl mb-2">Belum ada film dengan rating</p>
                                <p>Jadilah yang pertama memberikan ulasan!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
