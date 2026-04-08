export default function Loading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-white/5 rounded-lg" />
    </div>
  )
}
