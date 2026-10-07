"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Cloud,
  Contact,
  Eye,
  Lock,
  Mail,
  Package,
  Shield,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

const featureCards: Array<{ icon: LucideIcon; title: string }> = [
  { icon: Package, title: "Product management" },
  { icon: Users, title: "Human Resource Management" },
  { icon: Contact, title: "Customer management" },
  { icon: TrendingUp, title: "Sales management" },
];

export default function LoginPage() {
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-white font-sans">
      <section className="bg-[#1C1E3D] p-8 lg:p-12 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/70 bg-slate-700/40">
              <Cloud className="h-5 w-5 text-slate-200" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tight text-white">
              hope.
            </span>
          </div>

          <div className="hidden text-[10px] uppercase tracking-[0.28em] text-slate-300/90 sm:block">
            TEAM RYZA.DEV - 2026
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1 text-xs text-slate-300">
            <span className="text-slate-100">•</span>
            ONE WORKSPACE, EVERY TEAM
          </div>

          <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Making dreams come true.
          </h1>

          <p className="mt-4 max-w-lg text-sm text-slate-400 lg:text-base">
            Build faster, align better, and turn every customer interaction into momentum
            with a platform made for modern teams.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featureCards.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-[#181A35] p-5 shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#202347] text-slate-100">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-100">{title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 hidden items-center justify-between text-xs text-slate-400 lg:flex">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-300" />
            Trusted by growing teams
          </div>

          <div className="flex items-center -space-x-2">
            {[User, User, User].map((Icon, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1C1E3D] bg-[#202347]"
              >
                <Icon className="h-3.5 w-3.5 text-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center bg-[#0B0D23] p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to your HOPE account</p>
          </div>

          <div className="flex gap-1 rounded-2xl border border-slate-800 bg-[#13152A] p-1.5">
            <button
              type="button"
              onClick={() => setIsUserLogin(true)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isUserLogin
                  ? "bg-[#202347] text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setIsUserLogin(false)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                !isUserLogin
                  ? "bg-[#202347] text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Admin Login
            </button>
          </div>

          <form className="space-y-5">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                defaultValue="hello@hope.com"
                className="w-full rounded-xl border border-slate-800 bg-[#13152E] px-10 py-3 text-sm text-white placeholder:text-slate-500 focus:border-slate-600 focus:outline-none"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                defaultValue="password123"
                className="w-full rounded-xl border border-slate-800 bg-[#13152E] px-10 py-3 pr-11 text-sm text-white placeholder:text-slate-500 focus:border-slate-600 focus:outline-none"
                placeholder="Password"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-700 bg-[#13152E] text-[#8C92C8] focus:ring-[#8C92C8]"
                />
                Remember me
              </label>

              <a href="#" className="text-slate-300 transition hover:text-white">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8C92C8] py-3 font-medium text-slate-950 transition hover:bg-[#9EA5D8]"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-[#13152E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1A1D35]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google logo">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.7C16.7 3.5 14.6 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5c5.4 0 9.1-3.8 9.1-9.2 0-.6-.1-1.2-.2-1.7H12z"
                />
                <path
                  fill="#34A853"
                  d="M3.9 7.4l3.6 2.6c1-1.9 2.9-3.3 4.5-3.3 1.9 0 3.2.8 4 1.5l2.7-2.7C16.7 3.5 14.6 2.5 12 2.5A9.5 9.5 0 0 0 3.9 7.4z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.9 16.6A9.5 9.5 0 0 0 12 21.5c2.6 0 4.8-.9 6.4-2.4l-3-2.5c-.8.6-1.9 1.2-3.4 1.2-2.7 0-4.9-1.8-5.5-4.2l-3.6 2.9z"
                />
                <path
                  fill="#4285F4"
                  d="M12 8.7c1.4 0 2.6.5 3.6 1.4l2.6-2.6C16.7 4.9 14.6 3.9 12 3.9A9.5 9.5 0 0 0 3.9 7.4l3.6 2.6C8.1 7.6 9.9 8.7 12 8.7z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-medium text-white transition hover:text-slate-200">
                Sign up
              </a>
            </p>

            <p className="text-center text-xs text-slate-500">© 2026 HOPE · All rights reserved</p>
          </form>
        </div>
      </section>
    </main>
  );
}
