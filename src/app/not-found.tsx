import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh bg-[var(--bg)] text-center px-6">
      <p className="font-mono text-[80px] font-bold text-[var(--cyan)] leading-none tracking-tighter opacity-20">
        404
      </p>
      <h1 className="text-xl font-bold text-white mt-4">Page not found</h1>
      <p className="text-sm text-[var(--text-3)] mt-2 max-w-[300px]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--cyan)] text-black text-sm font-bold hover:brightness-110 transition-all"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
