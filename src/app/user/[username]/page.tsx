import { Star, Calendar, Award, Film, MessageSquare, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import RatingStats from "@/components/user/RatingStats"
import { auth } from "@/auth"
import ReportUserButton from "@/components/user/ReportUserButton"

export default async function UserProfile({ params }: { params: { username: string } }) {
  const session = await auth()
  const viewerIdRaw = (session?.user as any)?.id
  const viewerId = Number.isFinite(Number(viewerIdRaw)) ? Number(viewerIdRaw) : null

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: params.username },
        { id: /^\d+$/.test(params.username) ? Number(params.username) : undefined },
      ],
    },
    include: {
      reviews: {
        include: { movie: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      movies: {
        where: { status: "approved" },
        orderBy: { releaseDate: "desc" },
        take: 6,
      },
      _count: {
        select: {
          reviews: true,
          movies: { where: { status: "approved" } },
          watchlist: true,
        },
      },
    },
  })

  if (!user) notFound()

  const joinDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })

  const displayName = user.username || user.email.split("@")[0]
  const badges = ["Anggota"]
  if (user.role === "admin") badges.push("Admin")

  const allRatings = await prisma.review.findMany({
    where: { userId: user.id },
    select: { rating: true },
  })

  const ratingStats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const r of allRatings) {
    if (ratingStats[r.rating] !== undefined) ratingStats[r.rating]++
  }
  const totalRatings = allRatings.length

  const isOwnProfile = viewerId !== null && viewerId === user.id
  const canReport = viewerId !== null && !isOwnProfile

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col">
      <main className="flex-grow pt-8 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-5xl font-bold text-gray-400 border-4 border-[#121212] uppercase">
                {(user.username || user.email).charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{displayName}</h1>
                    <p className="text-gray-400 text-lg">@{user.username || "user"}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 flex items-center gap-1"
                        >
                          <Award size={14} /> {badge}
                        </span>
                      ))}
                    </div>

                    {canReport && (
                      <ReportUserButton targetUserId={user.id} 
                      targetUsername={user.username} 
                      />
                    )}
                  </div>
                </div>

                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio || "Belum ada bio."}</p>

                {/* Social Links */}
                <div className="flex gap-4 mb-6 flex-wrap">
                  {user.socialLinks && (user.socialLinks as any).instagram && (
                    <a
                      href={`https://instagram.com/${(user.socialLinks as any).instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-[#E1306C] transition-colors text-sm"
                    >
                      <Instagram size={18} /> @{(user.socialLinks as any).instagram}
                    </a>
                  )}
                  {user.socialLinks && (user.socialLinks as any).twitter && (
                    <a
                      href={`https://twitter.com/${(user.socialLinks as any).twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-[#1DA1F2] transition-colors text-sm"
                    >
                      <Twitter size={18} /> @{(user.socialLinks as any).twitter}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-400 border-t border-gray-700 pt-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    Bergabung {joinDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Film size={18} className="text-primary" />
                    {user._count.movies} Film Publikasi
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    {user._count.reviews} Ulasan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              {/* Published Movies */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Film className="text-primary" /> Film Publikasi
                </h2>

                {user.movies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.movies.map((movie) => (
                      <Link
                        href={`/movie/${movie.slug}`}
                        key={movie.id}
                        className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 hover:border-primary transition-colors group flex gap-4"
                      >
                        <div className="w-16 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                          {movie.posterUrl ? (
                            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "-"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Belum ada film yang dipublikasikan.</p>
                )}
              </div>

              {/* Recent Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="text-primary" /> Ulasan Terbaru
                </h2>

                <div className="space-y-4">
                  {user.reviews.length > 0 ? (
                    user.reviews.map((review) => (
                      <div key={review.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Link
                              href={`/movie/${review.movie.slug}`}
                              className="font-bold text-white text-lg hover:text-primary transition-colors"
                            >
                              {review.movie.title}
                            </Link>
                            <p className="text-gray-500 text-sm">
                              {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-sm font-bold">
                            <Star size={14} fill="currentColor" /> {review.rating}
                          </div>
                        </div>

                        <p className="text-gray-300 italic">&quot;{review.content || "Tidak ada komentar"}&quot;</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Belum ada ulasan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <RatingStats ratingStats={ratingStats} totalRatings={totalRatings} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
