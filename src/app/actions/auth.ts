"use server"

import prisma from "@/lib/prisma"

export async function checkUserExists(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        return !!user
    } catch (error) {
        console.error("Error checking user existence:", error)
        return false
    }
}
