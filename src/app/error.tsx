'use client'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-[var(--text-2)]">An unexpected error occurred.</p>
        {error.digest && (
          <p className="text-xs text-[var(--text-3)] font-mono">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-[var(--cyan)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
