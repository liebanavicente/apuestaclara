'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!email || password.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres')
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { referral_code: refCode },
      },
    })

    if (error) {
      setError(error.message === 'User already registered' ? 'Este email ya está registrado' : error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Revisa tu email</h1>
          <p className="text-slate-400 mb-6">
            Te hemos enviado un enlace de confirmación a <strong className="text-slate-200">{email}</strong>
          </p>
          <Link href="/login" className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-teal-400" />
            <span className="font-bold text-white text-xl">GañanesBets</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Crear cuenta gratis</h1>
          <p className="text-slate-400 text-sm">Sin tarjeta. Sin compromiso.</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          {refCode && (
            <div className="mb-4 rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-3 text-sm text-teal-300">
              Registro con código de referido: <strong>{refCode}</strong>
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-4">
            Al registrarte aceptas los{' '}
            <Link href="/terminos" className="text-slate-500 hover:text-slate-300">Términos de uso</Link>
            {' '}y la{' '}
            <Link href="/privacidad" className="text-slate-500 hover:text-slate-300">Política de privacidad</Link>.
            Debes tener al menos 18 años.
          </p>
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-teal-400 hover:text-teal-300 transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
