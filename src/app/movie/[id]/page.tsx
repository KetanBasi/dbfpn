import MovieHeader from "@/components/movie/MovieHeader"
import CommentsSection from "@/components/movie/CommentsSection"
import Section from "@/components/shared/Section"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Try to find by slug first (since we use slugs in URLs usually), but if ID is numeric, try ID too
    // Actually, the route is [id], but we might be passing a slug. 
    // Let's assume it's a slug for SEO friendly URLs, or handle both.
    // Based on previous mock data usage `MOVIES[id]`, it seemed to be an ID.
    // But real apps usually use slugs. Let's check if `id` is a number.

    const isNumeric = /^\d+$/.test(id)

    const movie = await prisma.movie.findFirst({
        where: isNumeric ? { id: Number(id) } : { slug: id },
        include: {
            people: {
                include: {
                    person: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            genres: {
                include: {
                    genre: true
                }
            }
        }
    })

    if (!movie) {
        notFound()
    }

    // Transform data for MovieHeader
    const director = movie.people.find(p => p.role === "director")?.person
    const writer = movie.people.find(p => p.role === "writer")?.person
    const cast = movie.people
        .filter(p => p.role === "cast")
        .map(p => ({
            name: p.person.name,
            role: p.characterName || "Cast",
            userId: p.person.userId,
            username: p.person.user?.username // Pass username
        }))

    const genres = movie.genres.map(g => g.genre.name)

    return (
        <div className="pb-12">
            <MovieHeader
                title={movie.title}
                year={movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : "TBA"}
                rating={4.5} // TODO: Calculate from reviews
                posterUrl={movie.posterUrl}
                bannerUrl={movie.bannerUrl}
                trailerUrl={movie.trailerUrl}
                videoUrl={movie.videoUrl}
                synopsis={movie.synopsis || ""}
                director={director?.name || "Unknown"}
                directorId={director?.userId}
                directorUsername={director?.user?.username}
                writer={writer?.name || "Unknown"}
                writerId={writer?.userId}
                writerUsername={writer?.user?.username}
                cast={cast}
                genres={genres}
                duration={`${movie.duration || 0}m`}
                language="Indonesian" // TODO: Add language to schema if needed
                releaseDate={movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "Coming Soon"}
            />

            <div className="max-w-7xl mx-auto px-4">
                <CommentsSection />
            </div>
        </div>
    )
}
