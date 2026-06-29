import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function ForecastsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <BarChart3 className="text-violet-400 mr-2 h-6 w-6" />
            AI Forecasts
          </h2>
          <p className="text-slate-400">Generate scenarios and predictive models for the coming months.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="h-8 w-8 text-violet-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Forecasting Engine</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Advanced predictive modeling is currently analyzing your data. Check back soon for deep, multi-variable scenario generation.
        </p>
        <button className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg font-medium transition cursor-not-allowed opacity-50">
          Generate New Forecast
        </button>
      </div>
    </div>
  )
}
