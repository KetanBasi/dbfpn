import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Add connection pool limit to DATABASE_URL if not present
function getDatabaseUrl(): string {
    const baseUrl = process.env.DATABASE_URL || ""
    // Check if connection_limit is already set
    if (baseUrl.includes("connection_limit")) {
        return baseUrl
    }
    // Add connection_limit parameter
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}connection_limit=5`
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
        db: {
            url: getDatabaseUrl(),
        },
    },
})

// Cache the client in both production and development
globalForPrisma.prisma = prisma

export default prisma
