import { Star, Filter } from "lucide-react"
import Link from "next/link"

export default function Top100() {
    // Mock Data Generator
    const movies = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        rank: i + 1,
        title: `Top Movie ${i + 1}`,
        year: 2020 + (i % 5),
        rating: (9.9 - (i * 0.1)).toFixed(1),
        director: "Famous Director",
        image: `https://placehold.co/150x225/252525/white.png?text=Movie+${i + 1}`
    }))

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
                        {movies.map((movie) => (
                            <Link href={`/movie/${movie.id}`} key={movie.id} className="bg-[#1a1a1a] rounded-xl p-4 flex gap-6 hover:bg-[#252525] transition-colors group cursor-pointer border border-transparent hover:border-gray-800">
                                <div className="text-4xl font-bold text-gray-700 w-16 flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                                    {movie.rank}
                                </div>
                                <img src={movie.image} alt={movie.title} className="w-24 h-36 object-cover rounded-lg shadow-lg" />
                                <div className="flex-1 py-2">
                                    <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{movie.title}</h2>
                                    <div className="text-gray-400 mb-4">{movie.year} • {movie.director}</div>
                                    <div className="flex items-center gap-2">
                                        <Star className="text-yellow-500 fill-yellow-500" size={20} />
                                        <span className="text-xl font-bold text-white">{movie.rating}</span>
                                        <span className="text-sm text-gray-500">/ 10</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="px-8 py-3 bg-[#1a1a1a] border border-gray-800 rounded-full text-white font-bold hover:bg-white hover:text-black transition-colors">
                            Muat Lebih Banyak
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
