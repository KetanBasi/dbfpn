import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined
}

// Add connection pool limit to DATABASE_URL if not present
function getDatabaseUrl(): string {
    const baseUrl = process.env.DATABASE_URL || ""
    if (baseUrl.includes("connection_limit")) {
        return baseUrl
    }
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}connection_limit=5`
}

const RETRY_CODES = ['P1001', 'P1002', 'P1008', 'P2024']
const MAX_RETRIES = 3

function createPrismaClient() {
    const client = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        datasources: {
            db: {
                url: getDatabaseUrl(),
            },
        },
    })

    return client.$extends({
        query: {
            $allModels: {
                async $allOperations({ operation, model, args, query }) {
                    let retries = 0

                    while (true) {
                        try {
                            return await query(args)
                        } catch (error: any) {
                            // Check if error is a connection error and we haven't exceeded retries
                            // Transactions cannot be retried easily, so skip them
                            if (
                                retries < MAX_RETRIES &&
                                RETRY_CODES.includes(error?.code) &&
                                !operation.includes('transaction')
                            ) {
                                retries++
                                const delay = Math.pow(2, retries) * 100 // Exponential backoff: 200ms, 400ms, 800ms
                                console.warn(`[Prisma] Database connection error (${error.code}). Retrying ${retries}/${MAX_RETRIES} in ${delay}ms...`)
                                await new Promise(r => setTimeout(r, delay))
                                continue
                            }
                            throw error
                        }
                    }
                },
            },
        },
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
