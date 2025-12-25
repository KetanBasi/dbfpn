"use server"

export async function submitReview(movieId: number, rating: number, review: string) {
  try {
    // TODO: ganti userId dari session kalau sudah ada auth
    const userId = 1

    const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId, userId, rating, comment: review }),
      cache: "no-store",
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { success: false, error: data?.error || "Gagal kirim ulasan" }
    }

    return { success: true, data }
  } catch {
    return { success: false, error: "Terjadi kesalahan" }
  }
}
