import { Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

export default function AdminMovies() {
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manajemen Film</h1>
                <button className="bg-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                    + Tambah Film
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan judul, sutradara..."
                        className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select className="bg-[#252525] border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                            <option value="">Semua Genre</option>
                            <option value="action">Action</option>
                            <option value="drama">Drama</option>
                            <option value="scifi">Sci-Fi</option>
                        </select>
                        <Filter className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                    </div>
                    <div className="relative">
                        <select className="bg-[#252525] border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                            <option value="">Semua Tahun</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                        <Filter className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#252525] text-gray-200 uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Judul</th>
                            <th className="px-6 py-4">Tahun</th>
                            <th className="px-6 py-4">Sutradara</th>
                            <th className="px-6 py-4">Genre</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {/* Mock Row 1 */}
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Inception</td>
                            <td className="px-6 py-4">2010</td>
                            <td className="px-6 py-4">Christopher Nolan</td>
                            <td className="px-6 py-4">Sci-Fi</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">Aktif</span></td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Eye size={18} /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-yellow-400"><Edit size={18} /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                        {/* Mock Row 2 */}
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">The Dark Knight</td>
                            <td className="px-6 py-4">2008</td>
                            <td className="px-6 py-4">Christopher Nolan</td>
                            <td className="px-6 py-4">Action</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">Aktif</span></td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Eye size={18} /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-yellow-400"><Edit size={18} /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                        {/* Mock Row 3 */}
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Interstellar</td>
                            <td className="px-6 py-4">2014</td>
                            <td className="px-6 py-4">Christopher Nolan</td>
                            <td className="px-6 py-4">Sci-Fi</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">Draft</span></td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Eye size={18} /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-yellow-400"><Edit size={18} /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Pagination (Mock) */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>Menampilkan 1-3 dari 12 film</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:bg-white/5 disabled:opacity-50" disabled>Sebelumnya</button>
                    <button className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:bg-white/5">Selanjutnya</button>
                </div>
            </div>
        </>
    )
}
