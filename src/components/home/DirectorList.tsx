import Image from "next/image"
import Link from "next/link"
import { ChevronRight, TrendingUp } from "lucide-react"
import Section from "../shared/Section"

const directors = [
    { id: 1, name: "Christopher Nolan", username: "christopher-nolan", image: "https://placehold.co/100x100/252525/white.png?text=CN", score: 98 },
    { id: 2, name: "Denis Villeneuve", username: "denis-villeneuve", image: "https://placehold.co/100x100/252525/white.png?text=DV", score: 95 },
    { id: 3, name: "Greta Gerwig", username: "greta-gerwig", image: "https://placehold.co/100x100/252525/white.png?text=GG", score: 92 },
    { id: 4, name: "Bong Joon-ho", username: "bong-joon-ho", image: "https://placehold.co/100x100/252525/white.png?text=BJ", score: 90 },
    { id: 5, name: "Quentin Tarantino", username: "quentin-tarantino", image: "https://placehold.co/100x100/252525/white.png?text=QT", score: 88 },
]

export default function DirectorList() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {directors.map((director, index) => (
                <Link
                    href={`/user/${director.username}`}
                    key={director.id}
                    className="bg-[#1a1a1a] rounded-xl p-4 flex flex-col items-center text-center hover:bg-[#252525] transition-colors group cursor-pointer border border-gray-800 hover:border-primary/50"
                >
                    <div className="relative mb-3">
                        <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-primary transition-colors">
                            <Image
                                src={director.image}
                                alt={director.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-gray-700 text-xs font-bold text-white">
                            #{index + 1}
                        </div>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors">{director.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                        <TrendingUp size={12} />
                        <span>{director.score} Skor Popularitas</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}
