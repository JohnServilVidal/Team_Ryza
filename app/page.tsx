'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white text-lg font-semibold">
        Loading Hope ERP Dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-4">
        <h1 className="text-2xl font-bold tracking-wider text-blue-500">HOPE ERP</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="rounded-xl bg-slate-800 p-8 border border-slate-700 shadow-xl space-y-4">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome to Hope ERP System! 🚀
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Naka-login ka na nang matagumpay gamit ang account na: <strong className="text-blue-400">{user?.email}</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
              <h3 className="font-bold text-lg text-blue-400">Inventory</h3>
              <p className="text-sm text-slate-400 mt-1">Manage products & stocks</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
              <h3 className="font-bold text-lg text-emerald-400">Sales</h3>
              <p className="text-sm text-slate-400 mt-1">Track orders & transactions</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
              <h3 className="font-bold text-lg text-purple-400">HR & Users</h3>
              <p className="text-sm text-slate-400 mt-1">Manage staff & roles</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}