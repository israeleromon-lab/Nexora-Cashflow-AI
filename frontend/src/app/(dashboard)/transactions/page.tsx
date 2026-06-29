"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Form state
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return;

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (data) setTransactions(data)
    setLoading(false)
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          category,
          description,
          date
        })
      })

      if (response.ok) {
        setIsAdding(false)
        setAmount("")
        setCategory("")
        setDescription("")
        await fetchTransactions()
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Transactions</h2>
          <p className="text-slate-400">Manage your revenue and expense entries.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-2" /> Add Entry
        </Button>
      </div>

      {isAdding && (
        <Card className="glass-card border-white/10 border border-primary/50">
          <CardHeader>
            <CardTitle className="text-white">New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="expense" className="bg-slate-900">Expense</option>
                  <option value="revenue" className="bg-slate-900">Revenue</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Amount (₦)</label>
                <Input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Category</label>
                <Input placeholder="e.g. Payroll" required value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <Input placeholder="Optional" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Date</label>
                <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="lg:col-span-5 flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-300 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Entry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-black/20 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400">No transactions found. Add one to get started.</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-white font-medium">{t.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-white/10 px-2.5 py-1 rounded-full text-xs text-slate-300">{t.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end font-bold ${t.type === 'revenue' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.type === 'revenue' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        ₦{t.amount.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
