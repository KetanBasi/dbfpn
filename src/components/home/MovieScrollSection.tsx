"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Section from "../shared/Section"
import MovieCard from "../shared/MovieCard"

interface Movie {
    id: string
    title: string
    description: string
    imageUrl: string
    year: string
    releaseDate?: string // Optional exact release date
}

interface MovieScrollSectionProps {
    title: string
    movies: Movie[]
    linkToAll: string
}

export default function MovieScrollSection({ title, movies, linkToAll }: MovieScrollSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef
            const scrollAmount = 300 // Adjust scroll amount
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" })
            }
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return
        setIsDragging(true)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return
        e.preventDefault()
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 2 // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    return (
        <Section
            title={title}
            action={
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="p-2 rounded-full bg-[#252525] hover:bg-primary hover:text-black transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-2 rounded-full bg-[#252525] hover:bg-primary hover:text-black transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <Link
                        href={linkToAll}
                        className="text-sm font-bold text-primary hover:underline whitespace-nowrap"
                    >
                        Lihat Semua
                    </Link>
                </div>
            }
        >
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
            >
                {movies.map((movie) => (
                    <div key={movie.id} className="min-w-[200px] md:min-w-[240px] select-none">
                        <MovieCard {...movie} />
                    </div>
                ))}
            </div>
        </Section>
    )
}
