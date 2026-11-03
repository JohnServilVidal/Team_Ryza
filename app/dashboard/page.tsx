'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Package, ShoppingCart, BarChart3, Users, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string>('staff');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getProfileRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Kunin ang role mula sa profiles table na ginawa natin sa Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data && data.role) {
          setUserRole(data.role);
        }
      }
      setLoading(false);
    }
    getProfileRole();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-medium">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      
      {/* 🛡️ SUPER ADMIN VIEW */}
      {userRole === 'admin' ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="px-3 py-1 bg-emerald-500/25 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-500/40 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Control Panel
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
                Executive Management Hub
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Mayroon kang kabuuang karapatan sa pamamahala ng sistema, user RBAC controls, at malalimang pagsusuri ng financial analytics.
              </p>
            </div>
            <Link 
              href="/" 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition"
            >
              ← Back to Welcome Page
            </Link>
          </div>

          {/* Admin Executive Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">Total Revenue</span>
              <p className="text-2xl font-black text-white">₱124,850.00</p>
              <span className="text-xs text-emerald-400 font-semibold">+14% from last month</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">Active Products</span>
              <p className="text-2xl font-black text-white">142 Items</p>
              <span className="text-xs text-slate-400">Categorized & Tracked</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">System Users (RBAC)</span>
              <p className="text-2xl font-black text-white">8 Users</p>
              <span className="text-xs text-purple-400 font-semibold">Super Admin & Staff</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">Low Stock Alerts</span>
              <p className="text-2xl font-black text-amber-400">3 Items</p>
              <span className="text-xs text-amber-500/80">Requires reorder soon</span>
            </div>
          </div>
        </div>
      ) : (
        /* 👤 REGULAR STAFF USER VIEW */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/40 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="px-3 py-1 bg-blue-500/25 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-500/40 flex items-center gap-1.5 w-fit">
                <UserCheck className="w-3.5 h-3.5" /> Staff Portal
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
                Point of Sale & Inventory Terminal
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Maligayang pagdating! Gamitin ang mga module sa ibaba para sa mabilisang pagproseso ng mga benta at pag-monitor ng imbentaryo.
              </p>
            </div>
            <Link 
              href="/" 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition"
            >
              ← Back to Welcome Page
            </Link>
          </div>
        </div>
      )}

      {/* Core Management Modules Grid */}
      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-bold text-white tracking-wide">Core Management Modules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inventory Module */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-lg">Inventory</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage product catalog, prices, quantities, and CRUD operations.
              </p>
            </div>
            <Link href="/inventory" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 pt-2">
              Open Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* User Management (Admin Exclusive or Restricted) */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-950 border border-blue-800/60 rounded-xl flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-lg">User Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control multi-tier RBAC access for Admin, Devs, Testers, & Staff.
              </p>
            </div>
            <Link href="/users" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 pt-2">
              Open Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Point of Sale Module */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-purple-950 border border-purple-800/60 rounded-xl flex items-center justify-center text-purple-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-lg">Point of Sale</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Process sales transactions with live automatic inventory stock deduction.
              </p>
            </div>
            <Link href="/pos" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 pt-2">
              Open Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-950 border border-amber-800/60 rounded-xl flex items-center justify-center text-amber-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-lg">Reports & Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                View revenue totals, total units sold statistics, and low stock reports.
              </p>
            </div>
            <Link href="/reports" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 pt-2">
              Open Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}