'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gift, Check } from 'lucide-react'

export default function RedeemPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error al canjear el código')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="h-7 w-7 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Canjear código</h1>
          <p className="text-slate-400 text-sm">Activa Premium gratis con un código promocional</p>
        </div>

        {success ? (
          <div className="rounded-xl border border-teal-500/40 bg-teal-950/30 p-6 text-center">
            <Check className="h-8 w-8 text-teal-400 mx-auto mb-2" />
            <p className="text-white font-semibold">¡Código canjeado!</p>
            <p className="text-slate-400 text-sm mt-1">Redirigiendo a tu dashboard...</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <form onSubmit={handleRedeem} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Código promocional</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="PRUEBA1MES"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:border-teal-500 focus:outline-none font-mono tracking-widest uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !code}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Canjeando...' : 'Canjear código'}
              </button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-4">
              No requiere tarjeta de crédito. Los códigos tienen validez limitada.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
