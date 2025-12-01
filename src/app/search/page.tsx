"use client"

import { Search as SearchIcon, Filter, ChevronDown, ChevronUp, Star } from "lucide-react"
import { useState } from "react"
import MovieCard from "@/components/shared/MovieCard"

export default function SearchPage() {
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Mock Data
    const movies = [
        {
            id: "1",
            title: "Lembaran Hitam",
            description: "Drama misteri yang mengungkap rahasia kelam masa lalu.",
            imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
            year: "2025",
            rating: 8.5
        },
        {
            id: "5",
            title: "Gundala 2",
            description: "Putra Petir kembali beraksi melawan kejahatan.",
            imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop",
            year: "Segera Tayang",
            releaseDate: "2025-12-25",
            rating: 0
        },
        // Add more mock data as needed
    ]

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col">
            <main className="flex-grow pt-8 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-6">Pencarian Film</h1>
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <SearchIcon className="absolute left-4 top-3.5 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari judul film, sutradara, atau aktor..."
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary text-lg"
                                />
                            </div>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`px-6 py-3 rounded-xl border flex items-center gap-2 font-medium transition-colors ${showAdvanced
                                    ? "bg-primary text-black border-primary"
                                    : "bg-[#1a1a1a] text-gray-300 border-gray-800 hover:border-gray-600"
                                    }`}
                            >
                                <Filter size={20} />
                                Filter Lanjutan
                                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showAdvanced && (
                            <div className="mt-6 p-6 bg-[#1a1a1a] rounded-xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Status Rilis</label>
                                    <select className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary">
                                        <option value="">Semua Status</option>
                                        <option value="released">Sudah Tayang</option>
                                        <option value="coming_soon">Segera Tayang</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Genre</label>
                                    <select className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary">
                                        <option value="">Semua Genre</option>
                                        <option value="action">Action</option>
                                        <option value="drama">Drama</option>
                                        <option value="horror">Horror</option>
                                        <option value="comedy">Comedy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Rentang Tahun</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Dari" className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary" />
                                        <input type="number" placeholder="Sampai" className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Urutkan</label>
                                    <select className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary">
                                        <option value="latest">Terbaru</option>
                                        <option value="popularity">Terpopuler</option>
                                        <option value="rating">Rating Tertinggi</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} {...movie} />
                        ))}
                    </div>

                    {/* Pagination / Load More */}
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
