'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Waves, Eye, EyeOff } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-neon">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-neon/20 bg-neon/10">
              <Waves className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold text-white">ApuestaClara</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido de vuelta</h1>
          <p className="text-texto-secundario text-sm">Accede a tu cuenta para continuar</p>
        </div>

        <div className="rounded-lg border border-neon/10 bg-superficie/80 p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-texto-secundario">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-md border border-neon/10 bg-superficie-hover px-3 py-2.5 text-sm text-white placeholder-texto-terciario focus:border-neon focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-texto-secundario">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-neon/10 bg-superficie-hover px-3 py-2.5 pr-10 text-sm text-white placeholder-texto-terciario focus:border-neon focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-terciario hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/reset-password" className="text-xs text-texto-terciario transition-colors hover:text-neon">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-neon py-2.5 font-semibold text-carbon transition-colors hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-texto-terciario">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-neon transition-colors hover:text-ambar">
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
