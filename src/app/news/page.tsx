import { Calendar, User } from "lucide-react"
import Link from "next/link"

export default function News() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col">
            <main className="flex-grow pt-8 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Berita & Artikel</h1>

                    {/* Featured Article */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <Link href="/news/pengabdi-setan-3" className="lg:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=2070&auto=format&fit=crop"
                                alt="Featured"
                                className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
                                <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold rounded mb-4 w-fit">Eksklusif</span>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                                    Pengabdi Setan 3: Konfirmasi Joko Anwar Tentang Kelanjutan Kisah Ibu
                                </h2>
                                <div className="flex items-center gap-6 text-sm text-gray-300">
                                    <span className="flex items-center gap-2"><User size={16} /> Budi Santoso</span>
                                    <span className="flex items-center gap-2"><Calendar size={16} /> 28 Nov 2025</span>
                                </div>
                            </div>
                        </Link>

                        {/* Sidebar / Recent List */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Terpopuler Minggu Ini</h3>
                            {[1, 2, 3, 4].map((i) => (
                                <Link href="/news/example-slug" key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="text-3xl font-bold text-gray-800 group-hover:text-primary transition-colors">0{i}</div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                            Review Film: Mengupas Tuntas Plot Twist yang Mengejutkan
                                        </h4>
                                        <span className="text-xs text-gray-500">27 Nov 2025</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Latest News Grid */}
                    <h3 className="text-2xl font-bold text-white mb-6">Terbaru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Link href="/news/example-slug" key={i} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors group cursor-pointer">
                                <div className="overflow-hidden">
                                    <img
                                        src={`https://placehold.co/400x250/252525/white.png?text=News+${i}`}
                                        alt="News"
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-bold text-primary mb-2 block">Industri</span>
                                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        Festival Film Indonesia 2025 Mengumumkan Nominasi Lengkap
                                    </h4>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                        Daftar lengkap nominasi untuk ajang penghargaan film paling bergengsi di Indonesia telah resmi dirilis...
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>5 menit baca</span>
                                        <span>26 Nov 2025</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
