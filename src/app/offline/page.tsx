'use client'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="text-center space-y-4 p-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--cyan)] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <line x1="12" y1="20" x2="12.01" y2="20"/>
          </svg>
        </div>
        <h1 className="text-xl font-semibold">You&apos;re offline</h1>
        <p className="text-[var(--text-2)] text-sm max-w-xs mx-auto">
          Check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--cyan)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
