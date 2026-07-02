"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClient } from "@/utils/supabase/client"

export default function ForecastsPage() {
  const [scenarios, setScenarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currency, setCurrency] = useState("₦")
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchScenarios = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrency(user.user_metadata?.currency || "₦")
      }
      
      const res = await fetch('/api/forecasts')
      const data = await res.json()
      if (data.scenarios) {
        setScenarios(data.scenarios)
      }
    } catch (err) {
      console.error("Failed to fetch scenarios", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScenarios()
  }, [])

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      setError(null)
      const res = await fetch('/api/forecasts', { method: 'POST' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to generate forecast")
      
      if (data.scenarios) {
        setScenarios(data.scenarios)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  // Format data for Recharts
  // We need to group by target_date, with base, upside, downside as keys
  const formatChartData = () => {
    const dataMap: Record<string, any> = {}
    
    scenarios.forEach(s => {
      const dateStr = new Date(s.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!dataMap[dateStr]) {
        dataMap[dateStr] = { name: dateStr }
      }
      // Calculate net cash flow (revenue - expense) for the plot
      const net = Number(s.projected_revenue) - Number(s.projected_expense)
      dataMap[dateStr][s.type] = net
    })

    return Object.values(dataMap).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
  }

  const chartData = formatChartData()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <BarChart3 className="text-violet-400 mr-2 h-6 w-6" />
            AI Forecasts
          </h2>
          <p className="text-slate-400">Predictive modeling for your business's financial future.</p>
        </div>
        
        {scenarios.length > 0 && (
          <button 
            onClick={handleGenerate} 
            disabled={generating}
            className="bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 px-4 py-2 rounded-lg font-medium transition flex items-center disabled:opacity-50"
          >
            {generating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Regenerate Model
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <RefreshCw className="h-8 w-8 text-violet-400 animate-spin mb-4" />
          <h3 className="text-xl font-medium text-white">Loading your scenarios...</h3>
        </div>
      ) : scenarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card border border-white/5 rounded-2xl">
          <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-violet-500/10">
            <BarChart3 className="h-10 w-10 text-violet-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Forecasting Engine</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
            Our AI will analyze your historical transactions to generate highly accurate Base, Upside, and Downside scenarios for the next 6 months.
          </p>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-50 flex items-center shadow-lg shadow-violet-500/25"
          >
            {generating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Historical Data...
              </>
            ) : (
              <>
                Generate 6-Month Forecast
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="glass-card border-white/5 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-violet-400" />
                Net Cash Flow Projections (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value: number) => [`${currency}${value.toLocaleString()}`, 'Net Cash Flow']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="upside" name="Upside Scenario" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="base" name="Base Case" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="downside" name="Downside Scenario" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-white/5">
              <CardContent className="p-6">
                <h4 className="text-emerald-400 font-semibold mb-2 flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> Upside Scenario</h4>
                <p className="text-slate-400 text-sm">Assumes 15-20% month-over-month growth in revenue with optimized and stable fixed expenses. Best case projection.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/5">
              <CardContent className="p-6">
                <h4 className="text-violet-400 font-semibold mb-2 flex items-center"><div className="w-3 h-3 rounded-full bg-violet-500 mr-2"></div> Base Case</h4>
                <p className="text-slate-400 text-sm">Based on the historical trailing 3-month average. Represents the most likely trajectory if current trends continue.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/5">
              <CardContent className="p-6">
                <h4 className="text-rose-400 font-semibold mb-2 flex items-center"><div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div> Downside Scenario</h4>
                <p className="text-slate-400 text-sm">Factors in a 10% drop in revenue combined with unexpected 5% inflation on variable expenses. Worst case projection.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
