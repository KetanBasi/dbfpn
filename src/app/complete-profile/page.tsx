import { Suspense } from "react"
import CompleteProfileForm from "./CompleteProfileForm"

export default function CompleteProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        }>
            <CompleteProfileForm />
        </Suspense>
    )
}
