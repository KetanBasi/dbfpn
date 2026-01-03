"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, User, Film, ShieldAlert, Settings, LogOut, Upload,
    ChevronDown, MessageSquare, Users, FolderCog
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

interface DashboardLayoutProps {
    children: React.ReactNode
    user?: any
}

interface MenuGroup {
    label: string
    icon: any
    items: { href: string; label: string; icon: any }[]
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const role = user?.role || session?.user?.role || "user"

    // Collapsible state for menu groups
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        moderasi: true,
        manajemen: false,
    })

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
    }

    const userLinks = [
        { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/dashboard/watchlist", label: "Tonton Nanti", icon: Film },
        { href: "/dashboard/submissions", label: "Kiriman Saya", icon: Upload },
        { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
    ]

    // Admin has groups instead of flat links
    const adminTopLinks = [
        { href: "/dashboard/admin", label: "Ringkasan", icon: LayoutDashboard },
    ]

    const adminGroups: MenuGroup[] = [
        {
            label: "Moderasi",
            icon: ShieldAlert,
            items: [
                { href: "/dashboard/admin/moderation/movies", label: "Moderasi Film", icon: Film },
                { href: "/dashboard/admin/moderation/users", label: "Moderasi User", icon: Users },
                { href: "/dashboard/admin/moderation/comments", label: "Moderasi Komentar", icon: MessageSquare },
            ]
        },
        {
            label: "Manajemen",
            icon: FolderCog,
            items: [
                { href: "/dashboard/admin/manage/movies", label: "Kelola Film", icon: Film },
                { href: "/dashboard/admin/manage/users", label: "Kelola User", icon: Users },
            ]
        }
    ]

    const adminBottomLinks = [
        { href: "/dashboard/admin/settings", label: "Pengaturan", icon: Settings },
    ]

    const isAdminPage = pathname.startsWith("/dashboard/admin")
    const isUserPage = !isAdminPage && pathname.startsWith("/dashboard")

    const isLinkActive = (href: string) => pathname === href

    const renderLink = (link: { href: string; label: string; icon: any }, indent = false) => {
        const Icon = link.icon
        const isActive = isLinkActive(link.href)
        return (
            <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${indent ? "ml-4" : ""
                    } ${isActive
                        ? "bg-primary text-black"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
            >
                <Icon size={16} />
                {link.label}
            </Link>
        )
    }

    const renderGroup = (group: MenuGroup, key: string) => {
        const isExpanded = expandedGroups[key]
        const hasActiveChild = group.items.some(item => isLinkActive(item.href))
        const Icon = group.icon

        return (
            <div key={key} className="space-y-1">
                <button
                    type="button"
                    onClick={() => toggleGroup(key)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${hasActiveChild
                        ? "text-primary bg-primary/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                >
                    <span className="flex items-center gap-3">
                        <Icon size={16} />
                        {group.label}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                </button>

                {isExpanded && (
                    <div className="space-y-1 mt-1">
                        {group.items.map(item => renderLink(item, true))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-[#050505]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#121212] border-r border-gray-800 flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <div className="mt-4">
                        <div className="text-white font-bold truncate">
                            {user?.name || (session?.user as any)?.name || "User"}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                            @{user?.username || (session?.user as any)?.username || session?.user?.email?.split('@')[0] || "user"}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-2">
                            {role === "admin" ? "Admin" : "User"}
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {/* Submit Button */}
                    <div className="mb-6">
                        <Link
                            href="/dashboard/submission"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold bg-primary text-black hover:bg-yellow-500 transition-colors"
                        >
                            <Upload size={18} />
                            Kirim Film Baru
                        </Link>
                    </div>

                    {isAdminPage ? (
                        <>
                            {/* Admin Top Links */}
                            {adminTopLinks.map(link => renderLink(link))}

                            {/* Admin Groups */}
                            <div className="space-y-2 mt-4">
                                {adminGroups.map((group, idx) =>
                                    renderGroup(group, idx === 0 ? "moderasi" : "manajemen")
                                )}
                            </div>

                            {/* Admin Bottom Links */}
                            <div className="mt-4 pt-4 border-t border-gray-800">
                                {adminBottomLinks.map(link => renderLink(link))}
                            </div>
                        </>
                    ) : (
                        /* User Links */
                        userLinks.map(link => renderLink(link))
                    )}

                    {/* Role Switch for Admins */}
                    {role === "admin" && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <Link
                                href={isAdminPage ? "/dashboard" : "/dashboard/admin"}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <User size={18} />
                                {isAdminPage ? "Beralih ke Dasbor User" : "Beralih ke Dasbor Admin"}
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
                    >
                        <LogOut size={18} />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
