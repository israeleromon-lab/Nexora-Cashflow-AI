"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Trash2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [userName, setUserName] = useState("Loading...")
  const [companyName, setCompanyName] = useState("Loading...")
  const [currency, setCurrency] = useState("₦")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrency(user.user_metadata?.currency || "₦")
        const { data: profile } = await supabase.from('profiles').select('first_name, last_name, company_name').eq('id', user.id).single()
        if (profile && profile.first_name) {
          setUserName(`${profile.first_name} ${profile.last_name || ''}`.trim())
          setCompanyName(profile.company_name || "Personal Account")
        } else if (user.user_metadata?.first_name) {
          setUserName(`${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim())
          setCompanyName("Personal Account")
        } else {
          setUserName("User")
          setCompanyName("Personal Account")
        }
      }
    }
    fetchUser()
  }, [supabase])

  const [isDeleting, setIsDeleting] = useState(false)

  const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value
    setCurrency(newCurrency)
    await supabase.auth.updateUser({ data: { currency: newCurrency } })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone and will delete all your financial data forever.")) return;
    
    try {
      setIsDeleting(true)
      const res = await fetch('/api/user/delete', { method: 'POST' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      router.push('/login')
    } catch (err) {
      console.error(err)
      alert("Failed to delete account. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Settings className="text-slate-400 mr-2 h-6 w-6" />
          Settings
        </h2>
        <p className="text-slate-400">Manage your account preferences and application settings.</p>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <div className="bg-white/5 border border-white/10 p-2 rounded-md text-white">{userName}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Company</label>
              <div className="bg-white/5 border border-white/10 p-2 rounded-md text-white">{companyName}</div>
            </div>
          </div>
          
          <div className="pt-4 space-y-1">
            <label className="text-sm font-medium text-slate-300">Currency Preference</label>
            <select 
              value={currency} 
              onChange={handleCurrencyChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="₦" className="bg-slate-900">₦ Naira (NGN)</option>
              <option value="$" className="bg-slate-900">$ Dollar (USD)</option>
              <option value="€" className="bg-slate-900">€ Euro (EUR)</option>
              <option value="£" className="bg-slate-900">£ Pound (GBP)</option>
              <option value="¥" className="bg-slate-900">¥ Yen (JPY)</option>
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <Button onClick={handleSignOut} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle className="text-rose-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            variant="destructive" 
            className="bg-rose-500 hover:bg-rose-600 text-white border-0 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
