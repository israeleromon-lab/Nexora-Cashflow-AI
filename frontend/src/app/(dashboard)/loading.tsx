import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <h3 className="text-xl font-medium text-white tracking-tight animate-pulse">
        Loading Nexora AI...
      </h3>
      <p className="text-sm text-slate-400">Fetching your latest financial data.</p>
    </div>
  )
}
