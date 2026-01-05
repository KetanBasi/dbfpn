import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-[#121212] text-gray-400 py-8 px-4 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-xs">
                <div className="flex gap-4">
                    <Link href="/dashboard/user/upgrade" className="hover:text-primary transition-colors font-medium">Layanan Premium</Link>
                    <span className="text-gray-600">|</span>
                    <Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link>
                    <span className="text-gray-600">|</span>
                    <Link href="#" className="hover:text-white transition-colors">Lisensi Data</Link>
                    <span className="text-gray-600">|</span>
                    <Link href="/terms" className="hover:text-white transition-colors">Syarat Penggunaan</Link>
                    <span className="text-gray-600">|</span>
                    <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                </div>
                <div className="text-gray-500">
                    © DBFPN - 2025
                </div>
            </div>
        </footer>
    )
}
