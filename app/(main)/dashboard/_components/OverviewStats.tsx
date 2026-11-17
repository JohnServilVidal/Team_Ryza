'use client'

import { useEffect, useState } from 'react'
import { Users, UserCheck, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type ProfileRow = {
  id: string
  email: string
  role: string | null
  created_at: string
}

export default function OverviewStats() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false })
      if (error) console.error('OverviewStats error:', error)
      setProfiles(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const total = profiles.length
  const admins = profiles.filter((p) => p.role === 'admin' || p.role === 'super_admin').length
  const staff = profiles.filter((p) => p.role === 'staff').length

  const stats = [
    { label: 'Total Users', value: total, icon: Users, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Admins', value: admins, icon: ShieldCheck, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Staff', value: staff, icon: UserCheck, color: 'text-emerald-400 bg-emerald-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-3xl font-bold">{loading ? '...' : value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-lg font-bold">Recent Users</h3>
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <div className="divide-y divide-white/5">
            {profiles.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 text-sm">
                <p className="font-medium">{p.email}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 uppercase text-slate-300">
                    {p.role}
                  </span>
                  <span className="text-slate-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}