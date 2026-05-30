'use client'
import { useState } from 'react'

export default function AdminResolverPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function run() {
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/admin/auto-resolve', { method: 'POST' })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-black text-white mb-2">Auto-resolver picks</h1>
      <p className="text-slate-400 text-sm mb-8">
        Consulta los resultados completados en The Odds API y resuelve automáticamente todos los picks pendientes.
        El cron lo hace cada hora solo, pero puedes forzarlo aquí.
      </p>

      <button onClick={run} disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-black px-6 py-3 rounded-xl transition-colors">
        {loading ? 'Resolviendo…' : '▶ Ejecutar ahora'}
      </button>

      {result && (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-2xl font-black text-green-400">{result.totalResolved}</p>
              <p className="text-xs text-slate-500">picks resueltos</p>
            </div>
            <div>
              <p className="text-2xl font-black text-red-400">{result.totalFailed}</p>
              <p className="text-xs text-slate-500">errores</p>
            </div>
          </div>
          {result.log?.length > 0 && (
            <div className="text-xs text-slate-400 space-y-1 font-mono max-h-64 overflow-y-auto">
              {result.log.map((line: string, i: number) => <p key={i}>{line}</p>)}
            </div>
          )}
          {result.log?.length === 0 && (
            <p className="text-slate-500 text-sm">Sin picks pendientes que resolver.</p>
          )}
        </div>
      )}
    </main>
  )
}
