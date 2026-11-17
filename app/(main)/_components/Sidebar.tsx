'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, BarChart3 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const links = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'staff'] },
  { href: '/inventory', label: 'Inventory Management', icon: Package, roles: ['super_admin', 'admin', 'staff'] },
  { href: '/users', label: 'User Management', icon: Users, roles: ['super_admin', 'admin'] },
  { href: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['super_admin', 'admin'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function loadRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setRole(data?.role ?? 'staff')
    }
    loadRole()
  }, [])

  const visible = links.filter((l) => role && l.roles.includes(role))

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-950 p-4 flex flex-col">
      <h1 className="px-3 py-4 text-xl font-extrabold tracking-tight">HOPE ERP</h1>

      <nav className="mt-4 flex flex-col gap-1">
        {visible.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}