'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const restricted: Record<string, string[]> = {
  '/users': ['super_admin', 'admin'],
  '/reports': ['super_admin', 'admin'],
}

export default function RouteGuard() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const rule = Object.keys(restricted).find(
      (p) => pathname === p || pathname.startsWith(p + '/')
    )
    if (!rule) return

    const supabase = createClient()
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      const role = data?.role ?? 'staff'
      if (!restricted[rule!].includes(role)) {
        router.replace('/dashboard')
      }
    }
    check()
  }, [pathname, router])

  return null
}