import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/Toast"
import SessionProvider from "@/components/providers/SessionProvider"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DBFPN",
  description: "Movie Database and Streaming Platform",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
