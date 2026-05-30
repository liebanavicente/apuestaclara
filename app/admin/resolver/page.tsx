'use client'
import { useState, useEffect } from 'react'

interface Pick {
  id: string
  user_id: string
  description: string
  selection: string
  odds: number
  status: string
  profiles: { username: string } | null
}

export default function AdminResolverPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [picks, setPicks] = useState<Pick[]>([])
  const [resolving, setResolving] = useState<string | null>(null)

  useEffect(() => { loadPicks() }, [])

  async function loadPicks() {
    const res = await fetch('/api/admin/pending-picks')
    if (res.ok) setPicks(await res.json())
  }

  async function run() {
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/admin/auto-resolve', { method: 'POST' })
    const data = await res.json()
    setResult(data)
    setLoading(false)
    loadPicks()
  }

  async function manualResolve(id: string, result: 'won' | 'lost') {
    setResolving(id)
    await fetch(`/api/picks/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    setResolving(null)
    loadPicks()
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-black text-white mb-2">Resolver picks</h1>
      <p className="text-slate-400 text-sm mb-8">Auto-resolver usa The Odds API. Resolución manual para penaltis, prórroga o correcciones.</p>

      <button onClick={run} disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-black px-6 py-2.5 rounded-xl transition-colors mb-6">
        {loading ? 'Resolviendo…' : '▶ Auto-resolver'}
      </button>

      {result && (
        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm">
          <span className="text-green-400 font-bold">{result.totalResolved} resueltos</span>
          {result.totalFailed > 0 && <span className="text-red-400 font-bold ml-4">{result.totalFailed} errores</span>}
          {result.log?.map((l: string, i: number) => <p key={i} className="text-slate-500 text-xs mt-1 font-mono">{l}</p>)}
        </div>
      )}

      {/* Picks pendientes */}
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Picks pendientes ({picks.length})</h2>
      {picks.length === 0 && <p className="text-slate-600 text-sm">Sin picks pendientes.</p>}
      <div className="space-y-2">
        {picks.map(p => (
          <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{p.description}</p>
              <p className="text-yellow-400 text-xs">→ {p.selection} @ {p.odds.toFixed(2)}</p>
              <p className="text-slate-600 text-xs">{(p as any).username}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => manualResolve(p.id, 'won')} disabled={resolving === p.id}
                className="text-xs bg-green-500/20 hover:bg-green-500/40 text-green-400 font-bold px-3 py-1.5 rounded-lg disabled:opacity-50">
                ✓ Ganó
              </button>
              <button onClick={() => manualResolve(p.id, 'lost')} disabled={resolving === p.id}
                className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold px-3 py-1.5 rounded-lg disabled:opacity-50">
                ✗ Perdió
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
