"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const bio = formData.get("bio") as string
    const instagram = formData.get("instagram") as string
    const twitter = formData.get("twitter") as string

    try {
        // Check if username is taken (if changed)
        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: { username },
            })
            if (existingUser && existingUser.id !== Number(session.user.id)) {
                return { error: "Username already taken" }
            }
        }

        await prisma.user.update({
            where: { id: Number(session.user.id) },
            data: {
                name,
                username,
                bio,
                socialLinks: {
                    instagram,
                    twitter
                }
            }
        })

        revalidatePath("/dashboard/settings")
        revalidatePath(`/user/${username || session.user.id}`)

        return { success: true }
    } catch (error) {
        console.error("Failed to update profile:", error)
        return { error: "Failed to update profile" }
    }
}
