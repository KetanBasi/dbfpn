import Image from "next/image"
import { Calendar, User, Clock } from "lucide-react"
import CommentsSection from "@/components/movie/CommentsSection"

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    // Mock Article Data
    const article = {
        title: "Pengabdi Setan 3: Konfirmasi Joko Anwar Tentang Kelanjutan Kisah Ibu",
        slug: slug,
        image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=2070&auto=format&fit=crop",
        writer: "Budi Santoso",
        date: "28 November 2025",
        readTime: "5 menit baca",
        content: `
            <p class="mb-4">Sutradara kondang Joko Anwar akhirnya buka suara mengenai kelanjutan franchise horor tersukses di Indonesia, Pengabdi Setan. Dalam wawancara eksklusif terbaru, beliau memberikan sinyal kuat bahwa kisah Ibu belum berakhir.</p>
            
            <p class="mb-4">"Semesta Pengabdi Setan itu luas. Apa yang kita lihat di film kedua baru permukaannya saja. Masih banyak misteri tentang sekte penyembah setan yang belum terungkap," ujar Joko Anwar.</p>
            
            <h2 class="text-2xl font-bold text-white mt-8 mb-4">Fokus pada Asal Usul Sekte</h2>
            <p class="mb-4">Rumor yang beredar menyebutkan bahwa film ketiga akan mengambil latar waktu jauh sebelum kejadian di film pertama, mengeksplorasi bagaimana sekte tersebut pertama kali terbentuk dan bagaimana Ibu bisa terjerat di dalamnya.</p>
            
            <p class="mb-4">Para penggemar berspekulasi bahwa setting tahun 50-an atau 60-an akan menjadi latar utama, memberikan nuansa vintage horror yang menjadi ciri khas Joko Anwar.</p>
            
            <h2 class="text-2xl font-bold text-white mt-8 mb-4">Kapan Rilis?</h2>
            <p class="mb-4">Meski belum ada tanggal pasti, proses pra-produksi dikabarkan akan dimulai pertengahan tahun depan. Jika berjalan lancar, kita mungkin bisa menyaksikan teror Ibu kembali di bioskop pada tahun 2027.</p>
        `
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col">
            <main className="flex-grow pt-8 pb-12 px-6">
                <article className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold border border-primary/20">Berita Film</span>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} /> {article.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} /> {article.readTime}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{article.title}</h1>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                                {article.writer.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-bold">{article.writer}</p>
                                <p className="text-gray-500 text-xs">Penulis Senior</p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-10 border border-gray-800">
                        <Image src={article.image} alt={article.title} fill className="object-cover" priority />
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none text-gray-300 mb-12"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Comments */}
                    <div className="border-t border-gray-800 pt-10">
                        <h2 className="text-2xl font-bold text-white mb-6">Diskusi</h2>
                        <CommentsSection />
                    </div>
                </article>
            </main>
        </div>
    )
}
