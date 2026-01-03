import Redis from "ioredis"

const valkeyUrl = process.env.VALKEY_URL || process.env.REDIS_URL

if (!valkeyUrl) {
    console.warn("VALKEY_URL or REDIS_URL not set, caching will be disabled")
}

let redis: Redis | null = null

if (valkeyUrl) {
    try {
        redis = new Redis(valkeyUrl, {
            // Retry strategy with reasonable defaults
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000)
                return delay
            },
            // Don't crash app on connection failure
            maxRetriesPerRequest: 3
        })

        redis.on("error", (err) => {
            console.error("Valkey/Redis connection error:", err)
        })

        redis.on("connect", () => {
            console.log("Connected to Valkey/Redis")
        })

    } catch (error) {
        console.error("Failed to initialize Valkey/Redis client:", error)
    }
}

export default redis
