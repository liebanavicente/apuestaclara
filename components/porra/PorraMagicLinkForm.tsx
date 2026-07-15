'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function PorraMagicLinkFormInner() {
  const searchParams = useSearchParams()
  const hadAuthError = searchParams.get('authError') === '1'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    hadAuthError ? 'El enlace ha caducado o se abrió en otra app/navegador distinto al que lo pidió. Pide uno nuevo.' : null
  )
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Dinos cómo te llamas')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/porra`,
        shouldCreateUser: true,
        data: { display_name: name.trim() },
      },
    })

    if (authError) {
      setError('No se pudo enviar el enlace. Revisa el email e inténtalo de nuevo.')
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-amarillo/20 bg-superficie/60 p-8 text-center">
        <div className="mb-4 text-4xl">✉️</div>
        <h2 className="text-xl font-black text-white">Revisa tu email</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-texto-secundario">
          Te hemos enviado un enlace mágico a <strong className="text-white">{email}</strong>. Ábrelo desde el mismo
          navegador/app en el que pediste el enlace para entrar y hacer tu porra — sin contraseña.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-amarillo/20 bg-superficie/60 p-6 sm:p-8">
      <h2 className="text-center text-xl font-black text-white sm:text-2xl">Apúntate a la porra 🇪🇸</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-center text-sm text-texto-secundario">
        Solo tu nombre y tu email. Te mandamos un enlace mágico para entrar, sin contraseñas.
      </p>

      <div className="mx-auto mt-6 max-w-sm space-y-3">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-texto-secundario">
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Cómo te llamas"
            className="w-full rounded-xl border border-superficie-hover bg-carbon/60 px-4 py-3 text-white placeholder-texto-terciario focus:border-amarillo focus:outline-none focus:ring-1 focus:ring-amarillo/50"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-texto-secundario">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded-xl border border-superficie-hover bg-carbon/60 px-4 py-3 text-white placeholder-texto-terciario focus:border-amarillo focus:outline-none focus:ring-1 focus:ring-amarillo/50"
            required
          />
        </div>

        {error && <p className="text-sm font-semibold text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="shine-btn mt-2 w-full rounded-xl bg-rojo px-6 py-3.5 font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Enviando…' : 'Enviarme el enlace mágico ✉️'}
        </button>
      </div>
    </form>
  )
}

export function PorraMagicLinkForm() {
  return (
    <Suspense>
      <PorraMagicLinkFormInner />
    </Suspense>
  )
}
