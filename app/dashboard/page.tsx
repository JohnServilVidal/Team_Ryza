'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white relative">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-emerald-950">
              H
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide text-white">HOPE ERP</h1>
              <p className="text-xs text-slate-400">Enterprise Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block px-3 py-1 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold rounded-full">
              System Admin Active
            </span>
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              ← Back to Welcome Page
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8 z-10 flex-1">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-2 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Welcome back, <span className="text-emerald-400">Administrator</span> 👋
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Here is a real-time overview of your enterprise metrics, system operations, and core management modules.
          </p>
        </div>

        {/* Live Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Total Revenue</span>
              <span className="text-emerald-400 text-sm">💰</span>
            </div>
            <p className="text-2xl font-black text-white">₱124,850.00</p>
            <p className="text-xs text-emerald-400 font-medium">↑ +14% from last month</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-blue-500/40 transition">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Active Products</span>
              <span className="text-blue-400 text-sm">📦</span>
            </div>
            <p className="text-2xl font-black text-white">142 Items</p>
            <p className="text-xs text-slate-400 font-medium">Categorized & Tracked</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-purple-500/40 transition">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>System Users (RBAC)</span>
              <span className="text-purple-400 text-sm">👥</span>
            </div>
            <p className="text-2xl font-black text-white">8 Users</p>
            <p className="text-xs text-purple-400 font-medium">Super Admin & Staff</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
              <span>Low Stock Alerts</span>
              <span className="text-amber-400 text-sm">⚠️</span>
            </div>
            <p className="text-2xl font-black text-amber-400">3 Items</p>
            <p className="text-xs text-amber-500/80 font-medium">Requires reorder soon</p>
          </div>
        </div>

        {/* Core ERP Modules Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Core Management Modules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Inventory Module */}
            <Link
              href="/inventory"
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 p-6 rounded-2xl transition group flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-emerald-950/50"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center justify-center text-emerald-400 text-2xl group-hover:scale-110 transition">
                  📦
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">Inventory</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage product catalog, prices, quantities, and CRUD operations.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                Open Module →
              </span>
            </Link>

            {/* User Management Module */}
            <Link
              href="/users"
              className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 p-6 rounded-2xl transition group flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-blue-950/50"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-950/80 border border-blue-800 rounded-xl flex items-center justify-center text-blue-400 text-2xl group-hover:scale-110 transition">
                  🛡️
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition">User Management</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Control multi-tier RBAC access for Admin, Devs, Testers, & Staff.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                Open Module →
              </span>
            </Link>

            {/* Point of Sale (POS) */}
            <Link
              href="/sales"
              className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 p-6 rounded-2xl transition group flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-purple-950/50"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-950/80 border border-purple-800 rounded-xl flex items-center justify-center text-purple-400 text-2xl group-hover:scale-110 transition">
                  💳
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition">Point of Sale</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Process sales transactions with live automatic inventory stock deduction.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                Open Module →
              </span>
            </Link>

            {/* Reports & Analytics */}
            <Link
              href="/reports"
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 p-6 rounded-2xl transition group flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-amber-950/50"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-950/80 border border-amber-800 rounded-xl flex items-center justify-center text-amber-400 text-2xl group-hover:scale-110 transition">
                  📊
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition">Reports & Analytics</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  View revenue totals, total units sold statistics, and low stock reports.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                Open Module →
              </span>
            </Link>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
        Hope ERP Management System • Built with Next.js, Supabase & Tailwind CSS
      </footer>

    </div>
  );
}