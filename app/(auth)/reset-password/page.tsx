'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function ResetForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    })
    if (error) {
      setError('No se pudo enviar el email. Verifica la dirección.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Revisa tu email</h1>
          <p className="text-texto-secundario mb-6">
            Si existe una cuenta con <strong className="text-white">{email}</strong>, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link href="/login" className="text-neon hover:text-ambar transition-colors text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-neon" />
            <span className="font-bold text-white text-xl">ApuestaClara</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Recuperar contraseña</h1>
          <p className="text-texto-secundario text-sm">Te enviaremos un enlace para restablecerla.</p>
        </div>

        <div className="rounded-xl border border-neon/10 bg-superficie/80 p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-texto-secundario mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-neon/10 bg-superficie-hover px-3 py-2.5 text-white placeholder-texto-terciario text-sm focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon hover:brightness-110 disabled:opacity-60 text-carbon font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        </div>

        <p className="text-center text-texto-terciario text-sm mt-5">
          <Link href="/login" className="text-neon hover:text-ambar transition-colors">
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}
