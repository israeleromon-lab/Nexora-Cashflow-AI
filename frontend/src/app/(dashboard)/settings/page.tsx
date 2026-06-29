"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Trash2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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
              <div className="bg-white/5 border border-white/10 p-2 rounded-md text-white">Alex Thompson</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Company</label>
              <div className="bg-white/5 border border-white/10 p-2 rounded-md text-white">Acme Corp</div>
            </div>
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
          <Button variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white border-0">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
