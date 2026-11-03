'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* Background Glow / Gradient Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="max-w-7xl w-full mx-auto flex justify-between items-center px-6 py-6 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-950">
            H
          </div>
          <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
            HOPE ERP
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/40 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto text-center my-auto px-6 py-16 space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 rounded-full shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Next-Gen Enterprise Management System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
          Elevate Your Business With <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Hope ERP</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          An all-in-one platform engineered for real-time inventory control, secure multi-tier RBAC security, seamless point-of-sale processing, and dynamic revenue analytics.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-emerald-900/50 transition transform hover:-translate-y-1 active:translate-y-0 text-center"
          >
            Get Started Now →
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-base border border-slate-800 rounded-2xl transition text-center"
          >
            Explore System Demo
          </Link>
        </div>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-16 text-left">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800/80 p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 text-lg group-hover:scale-110 transition">
              📦
            </div>
            <h3 className="text-emerald-400 font-bold text-base">Inventory Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Full CRUD operations with automated stock status adjustments.</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-800/80 p-6 rounded-2xl space-y-3 hover:border-blue-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400 text-lg group-hover:scale-110 transition">
              🛡️
            </div>
            <h3 className="text-blue-400 font-bold text-base">Secure RBAC</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Granular permissions for Super Admin, Admin, Devs, & Staff.</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-800/80 p-6 rounded-2xl space-y-3 hover:border-purple-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 text-lg group-hover:scale-110 transition">
              💳
            </div>
            <h3 className="text-purple-400 font-bold text-base">Point of Sale</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Instant checkout with real-time inventory stock deductions.</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-800/80 p-6 rounded-2xl space-y-3 hover:border-amber-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 text-lg group-hover:scale-110 transition">
              📊
            </div>
            <h3 className="text-amber-400 font-bold text-base">Live Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Comprehensive revenue tracking and low stock alerts.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs text-slate-500 py-6 border-t border-slate-900 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 Hope ERP System. All rights reserved.</p>
        <p className="text-emerald-500/80 font-medium">Engineered with Scrum Methodology by Team Ryza</p>
      </footer>

    </div>
  );
}