export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/85 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading TailorTracker...</p>
      </div>
    </div>
  )
}
