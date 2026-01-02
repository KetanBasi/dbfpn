import { redirect } from "next/navigation"

// Redirect old movies page to new movie moderation location
export default function MoviesPage() {
    redirect("/dashboard/admin/moderation/movies")
}
