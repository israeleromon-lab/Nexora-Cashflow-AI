import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Sparkles, TrendingUp, Receipt, Settings, ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function GuidePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-amber-400" />
            Quick Start Guide
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Everything you need to know to master Nexora CashFlow AI.
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        
        {/* Step 1 */}
        <Card className="glass-card border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mr-3 text-sm font-bold">1</span>
              Adding Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              Your cash flow analysis is only as good as the data you provide. To get started, you need to tell Nexora about your income and expenses.
            </p>
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 flex items-start">
              <Receipt className="h-5 w-5 text-emerald-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <strong className="text-white block mb-1">How to do it:</strong>
                <p className="text-sm">Navigate to the <strong>Transactions</strong> tab using the left sidebar. Click the "Add Transaction" button to record money moving in (Revenue) or out (Expense). The more categories you use, the better your insights will be!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="glass-card border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 mr-3 text-sm font-bold">2</span>
              Viewing Your Forecasts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              Once you have transactions recorded, Nexora will mathematically project your financial future based on your recent spending and earning habits.
            </p>
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 flex items-start">
              <TrendingUp className="h-5 w-5 text-violet-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <strong className="text-white block mb-1">How to use it:</strong>
                <p className="text-sm">Head over to the <strong>Forecasts</strong> tab. Here, you'll see a 6-month projection chart. You can also view AI-generated <em>Scenarios</em> (like "Aggressive Growth" or "Market Downturn") to see how resilient your cash balance is.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="glass-card border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 mr-3 text-sm font-bold">3</span>
              Consulting the AI Advisor
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              The true power of Nexora is the AI Advisor. It actively reads your transactions and forecasts to provide personalized financial guidance.
            </p>
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 flex items-start">
              <Sparkles className="h-5 w-5 text-amber-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <strong className="text-white block mb-1">How to use it:</strong>
                <p className="text-sm">Click on the <strong>AI Advisor</strong> tab in the sidebar. You can ask it direct questions like <em>"Am I spending too much on SaaS?"</em> or <em>"Can I afford to hire a new employee next month?"</em> It will calculate the answer based on your actual data.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="glass-card border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/20 text-slate-400 mr-3 text-sm font-bold">4</span>
              Changing Settings & Currency
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              You can easily customize how Nexora displays your numbers.
            </p>
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 flex items-start">
              <Settings className="h-5 w-5 text-slate-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <strong className="text-white block mb-1">How to do it:</strong>
                <p className="text-sm">Go to the <strong>Settings</strong> tab to switch between currencies (₦, $, €, £, ¥). This will instantly update all your charts, dashboards, and even the way the AI Advisor talks to you.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
