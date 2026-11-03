'use client'

import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // 1. Handle Login (Itinama na para dumiretso sa /dashboard)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      toast.error(error.message)
    } else {
      toast.success('Logged in successfully!')
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      toast.error(error.message)
    } else {
      setMessage('Account created successfully! Please check your email to confirm, then sign in.')
      toast.success('Account created successfully!')
      setPassword('')
      setMode('login')
    }
    setLoading(false)
  }

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      setError(error.message)
      toast.error(error.message)
    } else {
      setMessage('Password reset link sent to your email!')
      toast.success('Password reset link sent!')
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">HOPE ERP</h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === 'login' && 'Sign in to access your dashboard'}
            {mode === 'signup' && 'Create a new account'}
            {mode === 'forgot' && 'Reset your password'}
          </p>
        </div>

        {/* Alerts */}
        {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>}
        {message && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Forms */}
        {mode === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-white w-full pt-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-sm font-medium text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Bottom Switcher */}
        {mode !== 'forgot' && (
          <div className="text-center text-sm text-slate-400 border-t border-slate-700/50 pt-4">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-blue-400 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-blue-400 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}