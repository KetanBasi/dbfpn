"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Link as LinkIcon, Plus, Trash2, HelpCircle, Tag, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/Toast"
import { submitMovie } from "@/app/actions/movie"
import UserAutocomplete from "@/components/shared/UserAutocomplete"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SubmissionFormProps {
    maxActors: number
    initialData?: any // TODO: Type this properly
}

interface Actor {
    name: string
    role: string
    userId?: number | null
}

interface Genre {
    id: number
    name: string
    slug: string
}

export default function SubmissionForm({ maxActors, initialData }: SubmissionFormProps) {
    const [actors, setActors] = useState<Actor[]>(
        initialData?.people?.filter((p: any) => p.role === "cast").map((p: any) => ({
            name: p.person.name,
            role: p.characterName,
            userId: p.person.userId
        })) || [{ name: "", role: "" }, { name: "", role: "" }]
    )

    const [director, setDirector] = useState(initialData?.people?.find((p: any) => p.role === "director")?.person?.name || "")
    const [directorId, setDirectorId] = useState<number | null>(initialData?.people?.find((p: any) => p.role === "director")?.person?.userId || null)

    const [writer, setWriter] = useState(initialData?.people?.find((p: any) => p.role === "writer")?.person?.name || "")
    const [writerId, setWriterId] = useState<number | null>(initialData?.people?.find((p: any) => p.role === "writer")?.person?.userId || null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Genres state
    const [allGenres, setAllGenres] = useState<Genre[]>([])
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>(
        initialData?.genres?.map((g: any) => g.genre) || []
    )
    const [showGenreDropdown, setShowGenreDropdown] = useState(false)
    const genreDropdownRef = useRef<HTMLDivElement>(null)

    const { showToast } = useToast()
    const router = useRouter()

    // Fetch genres on mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch("/api/genres")
                const data = await res.json()
                if (data.genres) {
                    setAllGenres(data.genres)
                }
            } catch (error) {
                console.error("Error fetching genres:", error)
            }
        }
        fetchGenres()
    }, [])

    // Click outside handler for genre dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
                setShowGenreDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const addActor = () => {
        if (actors.length < maxActors) {
            setActors([...actors, { name: "", role: "" }])
        } else {
            showToast(`Maksimal ${maxActors} aktor diperbolehkan.`, "error")
        }
    }

    const removeActor = (index: number) => {
        const newActors = [...actors]
        newActors.splice(index, 1)
        setActors(newActors)
    }

    const updateActor = (index: number, field: keyof Actor, value: any) => {
        const newActors = [...actors]
        // @ts-ignore
        newActors[index][field] = value
        setActors(newActors)
    }

    const toggleGenre = (genre: Genre) => {
        if (selectedGenres.find(g => g.id === genre.id)) {
            setSelectedGenres(selectedGenres.filter(g => g.id !== genre.id))
        } else {
            setSelectedGenres([...selectedGenres, genre])
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        const submissionData = {
            id: initialData?.id, // Pass ID if editing
            title: formData.get("title") as string,
            releaseDate: formData.get("releaseDate") as string,
            duration: Number(formData.get("duration")),
            synopsis: formData.get("synopsis") as string,
            posterUrl: formData.get("posterUrl") as string,
            bannerUrl: formData.get("bannerUrl") as string,
            trailerUrl: formData.get("trailerUrl") as string,
            videoUrl: formData.get("videoUrl") as string,
            director,
            directorId,
            writer,
            writerId,
            actors: actors.filter(a => a.name.trim() !== ""),
            genres: selectedGenres.map(g => g.id)
        }

        const result = await submitMovie(submissionData)

        if (result.success) {
            showToast(result.message, "success")
            router.push("/dashboard/submissions") // Redirect to submissions list
            router.refresh()
        } else {
            showToast(result.message, "error")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Full Width Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Judul Film</label>
                    <input
                        name="title"
                        required
                        type="text"
                        defaultValue={initialData?.title}
                        className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-lg font-bold"
                        placeholder="Contoh: Inception"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tanggal Rilis (Opsional)</label>
                        <input
                            name="releaseDate"
                            type="date"
                            defaultValue={initialData?.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : ""}
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Durasi (Menit) (Opsional)</label>
                        <input
                            name="duration"
                            type="number"
                            defaultValue={initialData?.duration}
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="Contoh: 148"
                        />
                    </div>
                </div>

                {/* Genre Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <Tag size={14} /> Genre
                    </label>

                    {/* Selected Genres Pills */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedGenres.map(genre => (
                            <span
                                key={genre.id}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/30"
                            >
                                {genre.name}
                                <button
                                    type="button"
                                    onClick={() => toggleGenre(genre)}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Dropdown Trigger */}
                    <div ref={genreDropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-left text-gray-400 hover:border-gray-600 transition-colors flex items-center justify-between"
                        >
                            <span>{selectedGenres.length === 0 ? "Pilih genre..." : `${selectedGenres.length} genre dipilih`}</span>
                            <ChevronDown size={16} className={`transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {showGenreDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-[#252525] border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {allGenres.map(genre => (
                                    <button
                                        key={genre.id}
                                        type="button"
                                        onClick={() => toggleGenre(genre)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center justify-between ${selectedGenres.find(g => g.id === genre.id) ? "bg-primary/10 text-primary" : "text-white"
                                            }`}
                                    >
                                        <span>{genre.name}</span>
                                        {selectedGenres.find(g => g.id === genre.id) && (
                                            <span className="text-primary">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Sinopsis</label>
                    <textarea
                        name="synopsis"
                        required
                        defaultValue={initialData?.synopsis}
                        className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-32"
                        placeholder="Ringkasan singkat film..."
                    ></textarea>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            URL Poster (Vertikal)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-gray-500 hover:text-white" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Gambar vertikal (rasio 2:3) untuk tampilan kartu film.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                name="posterUrl"
                                type="text"
                                defaultValue={initialData?.posterUrl}
                                className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            URL Banner (Horizontal)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={14} className="text-gray-500 hover:text-white" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Gambar horizontal (rasio 16:9) untuk header halaman film.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                name="bannerUrl"
                                type="text"
                                defaultValue={initialData?.bannerUrl}
                                className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">URL Trailer (YouTube) (Opsional)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                name="trailerUrl"
                                type="text"
                                defaultValue={initialData?.trailerUrl}
                                className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">URL Film Lengkap (Opsional)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                name="videoUrl"
                                type="text"
                                defaultValue={initialData?.videoUrl}
                                className="w-full bg-[#252525] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Penulis</label>
                        <UserAutocomplete
                            value={writer}
                            onChange={(val, id) => {
                                setWriter(val)
                                setWriterId(id)
                            }}
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="Nama penulis"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Sutradara</label>
                        <UserAutocomplete
                            value={director}
                            onChange={(val, id) => {
                                setDirector(val)
                                setDirectorId(id)
                            }}
                            className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="Nama sutradara"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Pemeran ({actors.length}/{maxActors})</label>
                    <div className="space-y-3">
                        {actors.map((actor, index) => (
                            <div key={index} className="flex gap-4 items-center relative pl-8">
                                <span className="absolute left-0 text-gray-500 font-bold text-lg select-none w-6 text-center">{index + 1}</span>
                                <div className="flex-1">
                                    <UserAutocomplete
                                        value={actor.name}
                                        onChange={(val, id) => {
                                            const newActors = [...actors]
                                            newActors[index].name = val
                                            newActors[index].userId = id
                                            setActors(newActors)
                                        }}
                                        className="w-full bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                        placeholder="Nama Aktor"
                                    />
                                </div>

                                <input
                                    type="text"
                                    value={actor.role}
                                    onChange={(e) => updateActor(index, "role", e.target.value)}
                                    className="flex-1 bg-[#252525] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    placeholder="Peran"
                                />
                                {actors.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeActor(index)}
                                        className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addActor}
                        className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:text-yellow-400 transition-colors ml-8"
                    >
                        <Plus size={16} />
                        Tambah Aktor
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-lg text-gray-300 hover:text-white font-medium"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-lg bg-primary text-black font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Upload size={20} />
                        {isSubmitting ? "Mengirim..." : (initialData ? "Simpan Perubahan" : "Kirim Film")}
                    </button>
                </div>
            </form>
        </div>
    )
}
