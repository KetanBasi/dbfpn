import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import redis from "@/lib/redis"

// GET /api/genres - Fetch all genres
// Caches result in Valkey/Redis for 1 hour
export async function GET() {
    try {
        const cacheKey = "genres:all"

        // Try to fetch from cache first
        if (redis) {
            try {
                const cachedGenres = await redis.get(cacheKey)
                if (cachedGenres) {
                    return NextResponse.json({ genres: JSON.parse(cachedGenres), source: "cache" })
                }
            } catch (cacheError) {
                console.error("Redis get error:", cacheError)
                // Continue to DB on cache error
            }
        }

        // Fetch from DB if cache miss or Redis error
        const genres = await prisma.genre.findMany({
            orderBy: { name: "asc" }
        })

        // Store in cache for 1 hour (3600 seconds)
        if (redis && genres.length > 0) {
            try {
                await redis.setex(cacheKey, 3600, JSON.stringify(genres))
            } catch (cacheError) {
                console.error("Redis set error:", cacheError)
            }
        }

        return NextResponse.json({ genres, source: "database" })
    } catch (error) {
        console.error("Error fetching genres:", error)
        return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
    }
}
