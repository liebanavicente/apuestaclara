'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function LoginInner() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    // Full reload so the server reads fresh cookies
    window.location.href = redirect
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-600 mb-4">
            <TrendingUp className="h-6 w-6" />
            <span className="font-bold text-ink text-xl">GañanesBets</span>
          </Link>
          <h1 className="text-2xl font-bold text-ink mb-1">Bienvenido de vuelta</h1>
          <p className="text-ink-2 text-sm">Accede a tu cuenta para continuar</p>
        </div>

        <div className="rounded-xl gb-card p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-2 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-black/[0.08] bg-black/[0.04] px-3 py-2.5 text-ink placeholder-ink-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-ink-2 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-black/[0.08] bg-black/[0.04] px-3 py-2.5 text-ink placeholder-ink-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/reset-password" className="text-xs text-ink-3 hover:text-amber-600 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink hover:bg-[#333336] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-ink-3 text-sm mt-5">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-amber-600 hover:text-amber-700 transition-colors">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export function LoginForm() {
  return <Suspense><LoginInner /></Suspense>
}
