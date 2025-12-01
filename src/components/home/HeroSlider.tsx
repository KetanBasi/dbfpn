"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"

const HERO_SLIDES = [
    {
        id: "1",
        title: "Lembaran Hitam",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        description: "Saksikan trailernya",
    },
    {
        id: "2",
        title: "Paragiwisata",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
        description: "Saksikan trailernya",
    },
    {
        id: "3",
        title: "Kasih Tak Bertepi",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
        description: "Saksikan trailernya",
    },
]

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    }

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
            {HERO_SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover brightness-50"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                    <div className="absolute bottom-20 left-4 md:left-12 max-w-2xl text-white">
                        <div className="flex items-end gap-6">
                            <Link href={`/movie/${slide.id}`} className="relative w-32 h-48 hidden md:block rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 hover:scale-105 transition-transform">
                                <Image src={slide.image} alt="Poster" fill className="object-cover" />
                            </Link>
                            <div>
                                <Link href={`/movie/${slide.id}`} className="hover:text-primary transition-colors">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                                </Link>
                                <button className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full transition-all group-hover:scale-105">
                                    <div className="bg-white rounded-full p-1">
                                        <Play size={20} className="text-black fill-black ml-0.5" />
                                    </div>
                                    <span className="font-medium text-lg">{slide.description}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Side List (Desktop Only) - Simplified for now */}
            <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-black/80 to-transparent hidden lg:flex flex-col justify-center gap-4 p-4 z-20">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-all ${index === currentSlide ? 'bg-white/10 translate-x-[-10px]' : 'opacity-60 hover:opacity-100'}`}
                        onClick={() => setCurrentSlide(index)}
                    >
                        <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                            <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                        </div>
                        <div className="text-white">
                            <Play size={24} className="mb-1" />
                            <p className="font-bold text-sm leading-tight">{slide.title}</p>
                            <p className="text-xs text-gray-300">Saksikan trailernya</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
                <ChevronRight size={32} />
            </button>
        </div>
    )
}
