import HeroSlider from "@/components/home/HeroSlider"
import DirectorList from "@/components/home/DirectorList"
import Section from "@/components/shared/Section"
import MovieScrollSection from "@/components/home/MovieScrollSection"

const LATEST_MOVIES = [
  {
    id: "1",
    title: "Lembaran Hitam",
    description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    year: "2025"
  },
  {
    id: "2",
    title: "Paragiwisata",
    description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
    year: "2025"
  },
  {
    id: "3",
    title: "Kasih Tak Bertepi",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page.",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    year: "2025"
  },
  {
    id: "4",
    title: "Kembalikan Sahabat Ku",
    description: "A Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.",
    imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop",
    year: "2025"
  },
  {
    id: "10",
    title: "Misteri Gunung Merapi",
    description: "Legenda maklampir yang kembali menghantui desa.",
    imageUrl: "https://placehold.co/600x900/252525/white.png?text=MGM",
    year: "2025"
  },
  {
    id: "11",
    title: "Cinta di SMA",
    description: "Kisah cinta remaja yang penuh warna.",
    imageUrl: "https://placehold.co/600x900/252525/white.png?text=SMA",
    year: "2025"
  }
]

const COMING_SOON = [
  {
    id: "5",
    title: "Gundala 2",
    description: "Putra Petir kembali beraksi melawan kejahatan.",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop",
    year: "Segera Tayang",
    releaseDate: "2025-12-25"
  },
  {
    id: "6",
    title: "Sri Asih: The Beginning",
    description: "Asal usul pahlawan wanita pertama Indonesia.",
    imageUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=2028&auto=format&fit=crop",
    year: "Segera Tayang"
  },
  {
    id: "7",
    title: "Si Buta Dari Gua Hantu",
    description: "Pendekar buta yang berkelana mencari keadilan.",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2098&auto=format&fit=crop",
    year: "Segera Tayang",
    releaseDate: "2026-01-01"
  },
  {
    id: "8",
    title: "Godam",
    description: "Manusia besi yang memiliki kekuatan super.",
    imageUrl: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1974&auto=format&fit=crop",
    year: "Segera Tayang"
  },
  {
    id: "9",
    title: "Mandala",
    description: "Pendekar sakti mandraguna.",
    imageUrl: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=2070&auto=format&fit=crop",
    year: "Segera Tayang"
  },
  {
    id: "12",
    title: "Aquanus",
    description: "Pahlawan dari dasar laut.",
    imageUrl: "https://placehold.co/600x900/252525/white.png?text=Aquanus",
    year: "Segera Tayang"
  }
]

export default function Home() {
  return (
    <div className="pb-12">
      <HeroSlider />

      <MovieScrollSection
        title="Terbaru"
        movies={LATEST_MOVIES}
        linkToAll="/search?sort=latest"
      />

      <Section title="Sutradara Terpopuler" className="bg-[#0f0f0f]">
        <DirectorList />
      </Section>

      <MovieScrollSection
        title="Segera Tayang"
        movies={COMING_SOON}
        linkToAll="/search?status=coming_soon"
      />
    </div>
  )
}
