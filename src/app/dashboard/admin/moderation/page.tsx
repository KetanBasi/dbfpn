import { redirect } from "next/navigation"

// Redirect old moderation page to new user moderation location
export default function ModerationPage() {
  redirect("/dashboard/admin/moderation/users")
}
