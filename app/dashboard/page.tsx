'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Hope ERP Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Welcome back! Select a module to manage system operations.</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            ← Back to Welcome Page
          </Link>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Inventory Module */}
          <Link
            href="/inventory"
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-xl transition group flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-800 rounded-lg flex items-center justify-center text-emerald-400 font-bold mb-4">
                📦
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">Inventory Management</h2>
              <p className="text-sm text-slate-400 mt-2">Manage products, update stock quantities, prices, and delete items.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">Open Inventory →</span>
          </Link>

          {/* User Management Module */}
          <Link
            href="/users"
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-xl transition group flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-10 h-10 bg-blue-950 border border-blue-800 rounded-lg flex items-center justify-center text-blue-400 font-bold mb-4">
                👥
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition">User Management (RBAC)</h2>
              <p className="text-sm text-slate-400 mt-2">Control system roles for Super Admin, Admin, Devs, Testers, & Staff.</p>
            </div>
            <span className="text-xs font-semibold text-blue-400 flex items-center">Open Users →</span>
          </Link>

          {/* Sales / POS Module */}
          <Link
            href="/sales"
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-xl transition group flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-10 h-10 bg-purple-950 border border-purple-800 rounded-lg flex items-center justify-center text-purple-400 font-bold mb-4">
                💳
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition">Point of Sale (POS)</h2>
              <p className="text-sm text-slate-400 mt-2">Process product sales with live automatic stock deduction.</p>
            </div>
            <span className="text-xs font-semibold text-purple-400 flex items-center">Open POS →</span>
          </Link>

          {/* Reports & Analytics Module */}
          <Link
            href="/reports"
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-xl transition group flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-10 h-10 bg-amber-950 border border-amber-800 rounded-lg flex items-center justify-center text-amber-400 font-bold mb-4">
                📊
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition">Reports & Analytics</h2>
              <p className="text-sm text-slate-400 mt-2">View revenue metrics, items sold statistics, and low stock alerts.</p>
            </div>
            <span className="text-xs font-semibold text-amber-400 flex items-center">Open Reports →</span>
          </Link>

        </div>

      </div>
    </div>
  );
}