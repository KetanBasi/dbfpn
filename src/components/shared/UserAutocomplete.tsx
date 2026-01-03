"use client"

import { useState, useEffect, useRef } from "react"
import { searchUsers } from "@/app/actions/search"
import { User, X } from "lucide-react"
import Image from "next/image"

interface UserAutocompleteProps {
    value: string
    onChange: (value: string, userId: number | null) => void
    placeholder?: string
    className?: string
}

export default function UserAutocomplete({ value, onChange, placeholder, className }: UserAutocompleteProps) {
    const [query, setQuery] = useState(value)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Sync internal state with prop
    useEffect(() => {
        setQuery(value)
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearch = async (input: string) => {
        setQuery(input)
        // If user types, clear the selected ID to ensure consistency
        onChange(input, null)
        setSelectedUser(null)

        if (input.length >= 3) {
            const results = await searchUsers(input)
            setSuggestions(results)
            setIsOpen(true)
        } else {
            setSuggestions([])
            setIsOpen(false)
        }
    }

    const handleSelect = (user: any) => {
        setQuery(user.name || user.username)
        setSelectedUser(user)
        onChange(user.name || user.username, user.id)
        setIsOpen(false)
    }

    const handleClear = () => {
        setQuery("")
        setSelectedUser(null)
        onChange("", null)
    }

    return (
        <div ref={wrapperRef} className="relative">
            {/* Show pill button when user is selected, otherwise show input */}
            {selectedUser ? (
                <div className={`flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2.5`}>
                    <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden flex-shrink-0 relative">
                        {selectedUser.avatarUrl ? (
                            <Image src={selectedUser.avatarUrl} alt={selectedUser.username} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                {selectedUser.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">
                            {selectedUser.name || selectedUser.username}
                        </div>
                        <div className="text-primary text-xs">@{selectedUser.username}</div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={className}
                    placeholder={placeholder}
                />
            )}

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#252525] border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {suggestions.map((user) => (
                        <button
                            key={user.id}
                            type="button"
                            onClick={() => handleSelect(user)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-700 flex items-center gap-3 transition-colors border-b border-gray-800 last:border-0"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden flex-shrink-0 relative">
                                {user.avatarUrl ? (
                                    <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-white font-medium text-sm">{user.name || user.username}</div>
                                <div className="text-gray-400 text-xs">@{user.username}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
