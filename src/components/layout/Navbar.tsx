"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ChevronDown, User, Film, Settings, LogOut, Plus } from "lucide-react"
import { useState, useRef, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session, status } = useSession()

  const [searchType, setSearchType] = useState("Semua")
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const searchDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("q") as HTMLInputElement | null
    const q = input?.value?.trim() ?? ""

    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(searchType)}`)
    }
  }

  const searchOptions = ["Semua", "Film", "Sutradara", "Aktor"]

  const isLoggedIn = !!session?.user
  const user = session?.user as any
  const username = user?.username
  const avatarUrl = user?.avatar_url
  const displayName = user?.name || username || "User"

  return (
    <nav className="bg-[#121212] text-white py-3 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 border-b border-gray-800">
      <div className="flex items-center gap-4 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="bg-primary text-black font-bold px-3 py-1 rounded-md text-sm md:text-base tracking-tighter shrink-0"
        >
          DBFPN
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex items-center mx-4">
          <div className="relative flex items-center w-full">
            <div className="relative" ref={searchDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSearchDropdownOpen((v) => !v)}
                className="h-8 bg-white text-black px-3 rounded-l-sm text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition-colors shrink-0 border-r border-gray-300"
              >
                {searchType} <ChevronDown size={14} />
              </button>

              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white text-black rounded-md shadow-lg py-1 z-50">
                  {searchOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSearchType(option)
                        setIsSearchDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                name="q"
                type="text"
                placeholder="Cari"
                className="w-full h-8 bg-white text-black px-3 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="h-8 bg-white text-gray-500 px-3 rounded-r-sm hover:text-black transition-colors shrink-0 flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300 shrink-0">
          <Link href="/news" className="hover:text-white transition-colors">
            Berita
          </Link>
          <Link href="/top-100" className="hover:text-white transition-colors">
            Top 100
          </Link>

          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
          ) : isLoggedIn ? (
            /* Profile Dropdown */
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((v) => !v)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                )}
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-700 bg-[#252525]">
                    <p className="font-medium text-white truncate">{displayName}</p>
                    {username && (
                      <p className="text-xs text-gray-400 truncate">@{username}</p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {username && (
                      <Link
                        href={`/user/${username}`}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                      >
                        <User size={16} />
                        Profil Saya
                      </Link>
                    )}

                    <Link
                      href="/dashboard/submission"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                      Submit Film Baru
                    </Link>

                    <Link
                      href="/dashboard/user/submissions"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                    >
                      <Film size={16} />
                      Film Saya
                    </Link>

                    <Link
                      href="/dashboard/user/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                    >
                      <Settings size={16} />
                      Pengaturan
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-700 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="bg-primary text-black font-medium px-4 py-1.5 rounded-full hover:bg-yellow-400 transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
