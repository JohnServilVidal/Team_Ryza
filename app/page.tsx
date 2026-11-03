'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function WelcomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
      }
    };
    checkUser();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
      {/* Header / Navbar */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center py-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-emerald-400 tracking-wider">HOPE ERP</span>
        </div>
        <div className="space-x-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-lg transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-lg transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center my-auto space-y-6 py-12">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-full">
          All-in-One Business Management System
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Streamline Your Inventory, Sales & Analytics with <span className="text-emerald-400">Hope ERP</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          A modern enterprise resource planning system engineered for real-time stock tracking, RBAC security, seamless sales recording, and live revenue reporting.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl shadow-lg transition text-center"
            >
              Go to Main Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl shadow-lg transition text-center"
            >
              Access System / Log In
            </Link>
          )}
        </div>

        {/* System Features Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <h3 className="text-emerald-400 font-semibold">Inventory Management</h3>
            <p className="text-xs text-slate-400">Full CRUD operations with live stock updates and product status.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <h3 className="text-emerald-400 font-semibold">Role-Based RBAC</h3>
            <p className="text-xs text-slate-400">Multi-tier role controls for Super Admin, Admin, Devs, Testers, & Staff.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <h3 className="text-emerald-400 font-semibold">POS & Sales</h3>
            <p className="text-xs text-slate-400">Real-time stock deduction and immediate transaction logging.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <h3 className="text-emerald-400 font-semibold">Reports & Analytics</h3>
            <p className="text-xs text-slate-400">Revenue tracking, items sold metrics, and low stock warnings.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-900">
        © {new Date().getFullYear()} Hope ERP. Built by Scrum Team Ryza. All rights reserved.
      </footer>
    </div>
  );
} 