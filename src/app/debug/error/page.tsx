export default function DebugErrorPage() {
    // This page intentionally throws an error to test the error boundary
    throw new Error("Simulated Server-Side Error: This is a test to verify the Error UI.")

    return (
        <div>
            If you see this, the error failed to throw.
        </div>
    )
}
