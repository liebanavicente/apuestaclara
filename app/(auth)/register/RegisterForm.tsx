'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Waves, Eye, EyeOff } from 'lucide-react'
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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Revisa tu email</h1>
          <p className="text-texto-secundario mb-6">
            Te hemos enviado un enlace de confirmación a <strong className="text-white">{email}</strong>
          </p>
          <Link href="/login" className="text-sm text-neon transition-colors hover:text-ambar">
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-neon/20 bg-neon/10 text-neon">
              <Waves className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold text-white">ApuestaClara</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Crear cuenta gratis</h1>
          <p className="text-texto-secundario text-sm">Sin tarjeta. Sin compromiso.</p>
        </div>

        <div className="rounded-lg border border-neon/10 bg-superficie/80 p-6">
          {refCode && (
            <div className="mb-4 rounded-md border border-neon/30 bg-neon/10 px-4 py-3 text-sm text-neon">
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
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-md border border-neon/10 bg-superficie-hover px-3 py-2.5 pr-10 text-sm text-white placeholder-texto-terciario focus:border-neon focus:outline-none"
                  required
                  minLength={8}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-neon py-2.5 font-semibold text-carbon transition-colors hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-xs text-texto-terciario text-center mt-4">
            Al registrarte aceptas los{' '}
            <Link href="/terminos" className="text-texto-terciario hover:text-texto-secundario">Términos de uso</Link>
            {' '}y la{' '}
            <Link href="/privacidad" className="text-texto-terciario hover:text-texto-secundario">Política de privacidad</Link>.
            Debes tener al menos 18 años.
          </p>
        </div>

        <p className="mt-5 text-center text-sm text-texto-terciario">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-neon transition-colors hover:text-ambar">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
