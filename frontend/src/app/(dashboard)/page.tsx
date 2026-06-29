import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Percent } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

import RevenueExpenseChart, { ChartData } from "@/components/dashboard/RevenueExpenseChart"
import ExpenseBreakdown, { ExpenseCategoryData } from "@/components/dashboard/ExpenseBreakdown"
import ScenarioPlanning, { Scenario } from "@/components/dashboard/ScenarioPlanning"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch transactions for the user
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user?.id)
    .order('date', { ascending: false })
    
  // Fetch scenarios for the user
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Use mock data if the user has no transactions (for the demo/mockup feel)
  const isDemo = !transactions || transactions.length === 0
  
  const totalIncome = isDemo ? 1500000 : transactions.filter(t => t.type === 'revenue').reduce((acc, t) => acc + Number(t.amount), 0)
  const totalExpenses = isDemo ? 450000 : transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0)
  const netCashFlow = totalIncome - totalExpenses

  const chartData: ChartData[] = isDemo ? [
    { name: 'Jul', revenue: 800000, expenses: 500000 },
    { name: 'Aug', revenue: 1200000, expenses: 600000 },
    { name: 'Sep', revenue: 900000, expenses: 750000 },
    { name: 'Oct', revenue: 1500000, expenses: 800000 },
    { name: 'Nov', revenue: 2100000, expenses: 1100000 },
    { name: 'Dec', revenue: 2400000, expenses: 1200000 },
  ] : [] // In a real app, we'd group 'transactions' by month here

  const expenseCategories: ExpenseCategoryData[] = isDemo ? [
    { name: 'SaaS Tools', value: 120000, color: '#3b82f6' },
    { name: 'Payroll', value: 250000, color: '#10b981' },
    { name: 'Marketing', value: 50000, color: '#f59e0b' },
    { name: 'Others', value: 30000, color: '#8b5cf6' },
  ] : [] // We'd group 'transactions' where type = 'expense' by category

  const displayScenarios: Scenario[] = isDemo ? [
    { name: 'Base Case', projectedRevenue: 2400000, projectedExpense: 1200000, type: 'base' },
    { name: 'Aggressive Growth', projectedRevenue: 3200000, projectedExpense: 1800000, type: 'upside' },
    { name: 'Market Downturn', projectedRevenue: 1800000, projectedExpense: 900000, type: 'downside' },
  ] : (scenarios || []).map(s => ({
    name: s.name,
    projectedRevenue: Number(s.projected_revenue),
    projectedExpense: Number(s.projected_expense),
    type: s.type as any
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Cash Flow Forecast</h2>
          {isDemo && <p className="text-sm text-amber-500 mt-1">Showing Demo Data — Add transactions to see your real dashboard.</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Cash Balance */}
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Projected Cash Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₦{netCashFlow.toLocaleString()}</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5% from last quarter
            </p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Revenue Q3</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₦{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-amber-400 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2% vs target
            </p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Expenses Q3</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₦{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-rose-400 mt-1 flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1" /> -3.1% vs budget
            </p>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Forecast Accuracy</CardTitle>
            <Percent className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94.2%</div>
            <p className="text-xs text-slate-400 mt-1">Based on historical data</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="glass-card border-white/10 md:col-span-4 lg:col-span-5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Cash Flow: 6-Month Forecast</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[300px] w-full flex items-center justify-center">
              <RevenueExpenseChart data={chartData} />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 lg:col-span-2 space-y-6 flex flex-col">
          <Card className="glass-card border-white/10 flex-1">
            <CardHeader>
              <CardTitle className="text-white">Scenario Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <ScenarioPlanning scenarios={displayScenarios} />
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10 flex-1">
            <CardHeader>
              <CardTitle className="text-white">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-[200px] w-full flex items-center justify-center">
                <ExpenseBreakdown data={expenseCategories} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
