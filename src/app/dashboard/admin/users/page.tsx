import { redirect } from "next/navigation"

// Redirect old users page to new user management location
export default function UsersPage() {
  redirect("/dashboard/admin/manage/users")
}
