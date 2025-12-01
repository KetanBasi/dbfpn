"use server"

import prisma from "@/lib/prisma"

export async function searchUsers(query: string) {
    if (!query || query.length < 3) {
        return []
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { username: { contains: query, mode: "insensitive" } }
                ]
            },
            take: 3,
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true
            }
        })

        return users
    } catch (error) {
        console.error("Error searching users:", error)
        return []
    }
}
