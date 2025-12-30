import Link from "next/link"
import { Upload, Edit, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Image from "next/image"

export default async function MySubmissions() {
    const session = await auth()

    const submissions = await prisma.movie.findMany({
        where: { submitterId: Number(session?.user?.id) },
        orderBy: { updatedAt: 'desc' }
    })

    const pendingSubmissions = submissions.filter(m => m.status === 'pending' || m.status === 'rejected')
    const approvedSubmissions = submissions.filter(m => m.status === 'approved')

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending':
                return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs font-bold"><Clock size={12} /> Menunggu</span>
            case 'approved':
                return <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={12} /> Disetujui</span>
            case 'rejected':
                return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs font-bold"><XCircle size={12} /> Ditolak</span>
            default:
                return null
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Kiriman Saya</h1>
                <Link
                    href="/dashboard/submission"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-bold hover:bg-yellow-500 transition-colors text-sm"
                >
                    <Upload size={16} />
                    Kirim Film Baru
                </Link>
            </div>

            <div className="space-y-8">
                {/* Pending / Revision */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="text-yellow-500" /> Menunggu Moderasi / Revisi
                    </h2>
                    {pendingSubmissions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {pendingSubmissions.map(movie => (
                                <div key={movie.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                                    <div className="w-16 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                        {movie.posterUrl ? (
                                            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{movie.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StatusBadge status={movie.status} />
                                                    <span className="text-gray-500 text-xs">{new Date(movie.updatedAt || movie.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dashboard/submission/${movie.id}/edit`}
                                                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-primary hover:text-black transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Tidak ada film yang sedang menunggu moderasi.</p>
                    )}
                </div>

                {/* Approved */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-500" /> Disetujui (Publik)
                    </h2>
                    {approvedSubmissions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {approvedSubmissions.map(movie => (
                                <div key={movie.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex gap-4 items-center opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                        {movie.posterUrl ? (
                                            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link href={`/movie/${movie.slug}`} className="font-bold text-white text-lg hover:text-primary transition-colors">
                                                    {movie.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StatusBadge status={movie.status} />
                                                    <span className="text-gray-500 text-xs">{new Date(movie.releaseDate || movie.createdAt).getFullYear()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dashboard/submission/${movie.id}/edit`}
                                                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-primary hover:text-black transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Belum ada film yang disetujui.</p>
                    )}
                </div>
            </div>
        </>
    )
}
