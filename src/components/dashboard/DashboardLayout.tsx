"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, User, Film, ShieldAlert, Settings, LogOut, Upload } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

interface DashboardLayoutProps {
    children: React.ReactNode
    user?: any // Optional user data from server
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const role = user?.role || session?.user?.role || "user"

    // Console log the session data
    console.log(`Session Data: ${JSON.stringify(session)}`)

    const userLinks = [
        { href: "/dashboard/user", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/dashboard/user/watchlist", label: "Tonton Nanti", icon: Film },
        { href: "/dashboard/user/submissions", label: "Kiriman Saya", icon: Upload },
        { href: "/dashboard/user/settings", label: "Pengaturan", icon: Settings },
    ]

    const adminLinks = [
        { href: "/dashboard/admin", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/dashboard/admin/movies", label: "Film", icon: Film },
        { href: "/dashboard/admin/users", label: "Pengguna", icon: User },
        { href: "/dashboard/admin/moderation", label: "Moderasi", icon: ShieldAlert },
        { href: "/dashboard/admin/settings", label: "Pengaturan", icon: Settings },
    ]

    const isAdminPage = pathname.startsWith("/dashboard/admin")
    const isUserPage = pathname.startsWith("/dashboard/user") || pathname.startsWith("/dashboard/submission")

    // Decide links based on URL path, not just role
    const links = isAdminPage ? adminLinks : userLinks

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
                    {/* Submit Button - Visible to all users */}
                    <div className="mb-6">
                        <Link
                            href="/dashboard/submission"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold bg-primary text-black hover:bg-yellow-500 transition-colors"
                        >
                            <Upload size={18} />
                            Kirim Film Baru
                        </Link>
                    </div>

                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-black"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={18} />
                                {link.label}
                            </Link>
                        )
                    })}

                    {/* Role Switch for Admins */}
                    {role === "admin" && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <Link
                                href={isAdminPage ? "/dashboard/user" : "/dashboard/admin"}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <User size={18} />
                                {isAdminPage ? "Beralih ke Dasbor Pengguna" : "Beralih ke Dasbor Admin"}
                            </Link>
                        </div>
                    )}
                    {/* Note: User switching to Admin is removed as it should be role-based, but kept logic if needed for testing */}
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
