import { createClient } from '../utils/supabase/client'
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-wider text-blue-500">HOPE ERP</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-sm font-semibold rounded-lg transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="p-8 max-w-6xl mx-auto">
        <div className="rounded-xl bg-slate-900 p-8 border border-slate-800 shadow-2xl space-y-4">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome to Hope ERP System! 🚀
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Naka-login ka na nang matagumpay gamit ang account na: <strong className="text-blue-400">{user?.email}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Inventory Card Link */}
            <Link 
              href="/inventory"
              className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer block group"
            >
              <h3 className="font-bold text-lg text-blue-400 group-hover:text-blue-300">Inventory</h3>
              <p className="text-sm text-slate-400 mt-1">Manage products & stocks</p>
            </Link>

            {/* Sales Card */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="font-bold text-lg text-emerald-400">Sales</h3>
              <p className="text-sm text-slate-400 mt-1">Track orders & transactions</p>
            </div>

            {/* HR & Users Card */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="font-bold text-lg text-purple-400">HR & Users</h3>
              <p className="text-sm text-slate-400 mt-1">Manage staff & roles</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}