"use client"

import { useState, useEffect } from "react"
import { Search, Bell, HelpCircle, Menu, X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState("Loading...")
  const [companyName, setCompanyName] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
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
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center p-4 glass rounded-xl mb-4 shadow-lg border border-white/10">
        <div className="flex w-full justify-between items-center">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white transition p-2 mr-2 rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Left: Search Bar */}
          <div className="hidden md:flex items-center bg-black/20 rounded-full px-4 py-2 border border-white/5 w-96">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search transactions, reports..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
            />
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-x-2 md:gap-x-4 ml-auto">
            <Link href="/guide" title="Quick Start Guide" className="text-slate-400 hover:text-amber-400 transition p-2 rounded-full hover:bg-amber-400/10 hidden sm:block">
              <HelpCircle className="h-5 w-5" />
            </Link>
            
            <div className="h-8 w-px bg-white/10 mx-1 md:mx-2"></div>

            <div className="flex items-center gap-x-3 cursor-pointer hover:opacity-80 transition">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white leading-none">{userName}</p>
                <p className="text-xs text-slate-400 mt-1">{companyName}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 border-2 border-white/20 shadow-lg shadow-indigo-500/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full glass-card border border-white/10 rounded-xl p-4 z-50 md:hidden flex flex-col gap-2 mt-2 shadow-2xl">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium p-3 hover:bg-white/10 rounded-lg">Overview</Link>
          <Link href="/transactions" onClick={() => setMobileMenuOpen(false)} className="text-emerald-400 font-medium p-3 hover:bg-white/10 rounded-lg">Transactions</Link>
          <Link href="/forecasts" onClick={() => setMobileMenuOpen(false)} className="text-violet-400 font-medium p-3 hover:bg-white/10 rounded-lg">Forecasts</Link>
          <Link href="/ai-advisor" onClick={() => setMobileMenuOpen(false)} className="text-amber-400 font-medium p-3 hover:bg-white/10 rounded-lg">AI Advisor</Link>
          <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 font-medium p-3 hover:bg-white/10 rounded-lg">Settings</Link>
        </div>
      )}
    </div>
  )
}
