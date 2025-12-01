import Image from "next/image"

export default function About() {
    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">Tentang Kami</h1>

                <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 mb-12">
                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                        DBFPN (Database Film & Perfilman Nasional) adalah platform yang didedikasikan untuk pecinta film Indonesia. Kami hadir untuk memberikan informasi terlengkap mengenai film, aktor, dan sineas tanah air.
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                        Visi kami adalah menjadi ensiklopedia film Indonesia nomor satu yang tidak hanya menyajikan data, tetapi juga menjadi wadah komunitas bagi para penggemar film untuk berbagi ulasan dan diskusi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
                        <h3 className="text-2xl font-bold text-white mb-2">Lengkap</h3>
                        <p className="text-gray-400">Database film Indonesia dari masa ke masa.</p>
                    </div>
                    <div className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
                        <h3 className="text-2xl font-bold text-white mb-2">Akurat</h3>
                        <p className="text-gray-400">Data yang diverifikasi dan terpercaya.</p>
                    </div>
                    <div className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
                        <h3 className="text-2xl font-bold text-white mb-2">Komunitas</h3>
                        <p className="text-gray-400">Wadah diskusi bagi pecinta film.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
