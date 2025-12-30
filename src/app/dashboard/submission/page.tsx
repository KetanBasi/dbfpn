import SubmissionForm from "@/components/dashboard/SubmissionForm"
import { getConfig } from "@/lib/config"

export default function MovieSubmission() {
    const config = getConfig()

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Kirim Film</h1>
            <p className="text-gray-400 mb-8">Berkontribusi pada database dengan mengirimkan film baru. Semua kiriman memerlukan persetujuan admin.</p>

            <SubmissionForm maxActors={config.max_actors} />
        </div>
    )
}
