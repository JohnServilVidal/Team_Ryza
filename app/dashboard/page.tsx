'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Users, 
  BarChart3, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  Layers,
  Clock,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('staff');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUserData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');

      // Fetch role from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
      }
      setLoading(false);
    }

    getUserData();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Hope ERP Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800/80 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Hope ERP System Active
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">{userEmail.split('@')[0]}</span>!
          </h1>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Your system role is set to <span className="uppercase font-bold text-emerald-400">{userRole}</span>.
          </p>
        </div>

        <div className="flex items-center gap-4 z-10">
          {userRole === 'super_admin' || userRole === 'admin' ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl shadow-inner">
              <ShieldCheck className="w-4 h-4" /> {userRole === 'super_admin' ? 'Super Admin' : 'Admin'} Access
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-2xl shadow-inner">
              <UserCheck className="w-4 h-4" /> User / Staff Access
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-2xl border border-rose-900/50 transition flex items-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Role-Based Navigation Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" /> Authorized Modules for Your Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Inventory Card (Accessible to Everyone) */}
          <Link
            href="/inventory"
            className="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition duration-300 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">Inventory Catalog</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                View product listings, check stock quantities, and manage item pricing.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pt-2">
              <span>Open Inventory</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* User Management Card (Super Admin / Admin Only) */}
          {(userRole === 'super_admin' || userRole === 'admin') ? (
            <Link
              href="/users"
              className="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl transition duration-300 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-110 transition duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">User Management</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage system users, review registered accounts, and modify access roles.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2">
                <span>Manage Users</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl space-y-4 opacity-60 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">User Management</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Restricted to administrators only. Contact your system admin for access changes.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-2">
                <span>Access Denied</span>
              </div>
            </div>
          )}

          {/* Reports Card (Admin & Super Admin Only, or tailored per role) */}
          {(userRole === 'super_admin' || userRole === 'admin') ? (
            <Link
              href="/reports"
              className="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl transition duration-300 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">Reports & Analytics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Analyze inventory asset evaluations, financial metrics, and low-stock alerts.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 pt-2">
                <span>View Reports</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl space-y-4 opacity-60 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Reports & Analytics</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Restricted to administrative personnel.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-2">
                <span>Access Denied</span>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}