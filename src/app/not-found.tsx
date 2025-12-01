import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-400 max-w-md mb-8">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau dihapus.
            </p>
            <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors"
            >
                <Home size={20} />
                Kembali ke Beranda
            </Link>
        </div>
    )
}
