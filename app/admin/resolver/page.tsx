'use client'
import { useState, useEffect } from 'react'

interface Pick {
  id: string
  user_id: string
  description: string
  selection: string
  odds: number
  status: string
  points: number
  username: string
}

export default function AdminResolverPage() {
  const [autoLoading, setAutoLoading] = useState(false)
  const [autoResult, setAutoResult] = useState<any>(null)
  const [pending, setPending] = useState<Pick[]>([])
  const [resolved, setResolved] = useState<Pick[]>([])
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [pRes, rRes] = await Promise.all([
      fetch('/api/admin/pending-picks'),
      fetch('/api/admin/resolved-picks'),
    ])
    if (pRes.ok) setPending(await pRes.json())
    if (rRes.ok) setResolved(await rRes.json())
  }

  async function runAuto() {
    setAutoLoading(true)
    setAutoResult(null)
    const res = await fetch('/api/admin/auto-resolve', { method: 'POST' })
    setAutoResult(await res.json())
    setAutoLoading(false)
    loadAll()
  }

  async function resolve(id: string, result: 'won' | 'lost') {
    setActing(id)
    await fetch(`/api/picks/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    setActing(null)
    loadAll()
  }

  async function correct(id: string, result: 'won' | 'lost') {
    setActing(id)
    await fetch(`/api/picks/${id}/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    setActing(null)
    loadAll()
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-white mb-1">Resolver picks</h1>
      <p className="text-slate-500 text-sm mb-6">Resolución automática y manual. Puedes corregir picks ya resueltos.</p>

      <button onClick={runAuto} disabled={autoLoading}
        className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-colors mb-2">
        {autoLoading ? 'Resolviendo…' : '▶ Auto-resolver'}
      </button>

      {autoResult && (
        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm">
          <span className="text-green-400 font-bold">{autoResult.totalResolved} resueltos</span>
          {autoResult.log?.map((l: string, i: number) => <p key={i} className="text-slate-500 text-xs mt-0.5 font-mono">{l}</p>)}
        </div>
      )}

      {/* Pendientes */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Pendientes ({pending.length})</h2>
          <div className="space-y-2">
            {pending.map(p => (
              <PickRow key={p.id} pick={p} acting={acting}
                actions={[
                  { label: '✓ Ganó', result: 'won', fn: () => resolve(p.id, 'won') },
                  { label: '✗ Perdió', result: 'lost', fn: () => resolve(p.id, 'lost') },
                ]} />
            ))}
          </div>
        </section>
      )}

      {/* Resueltos hoy — para corregir */}
      {resolved.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Resueltos hoy — corregir si hace falta ({resolved.length})</h2>
          <div className="space-y-2">
            {resolved.map(p => (
              <PickRow key={p.id} pick={p} acting={acting}
                actions={[
                  { label: '✓ Corregir a ganado', result: 'won', fn: () => correct(p.id, 'won'), disabled: p.status === 'won' },
                  { label: '✗ Corregir a perdido', result: 'lost', fn: () => correct(p.id, 'lost'), disabled: p.status === 'lost' },
                ]} />
            ))}
          </div>
        </section>
      )}

      {pending.length === 0 && resolved.length === 0 && (
        <p className="text-slate-600 text-sm">Sin picks pendientes ni resueltos hoy.</p>
      )}
    </main>
  )
}

function PickRow({ pick, acting, actions }: {
  pick: Pick
  acting: string | null
  actions: { label: string; result: string; fn: () => void; disabled?: boolean }[]
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
      pick.status === 'won' ? 'border-green-500/20 bg-green-500/5' :
      pick.status === 'lost' ? 'border-red-500/20 bg-red-500/5' :
      'border-slate-800 bg-slate-900/50'
    }`}>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{pick.description}</p>
        <p className="text-yellow-400 text-xs">→ {pick.selection} @ {pick.odds.toFixed(2)}</p>
        <p className="text-slate-600 text-xs">{pick.username}
          {pick.status !== 'pending' && (
            <span className={`ml-2 ${pick.status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
              {pick.status === 'won' ? `+${pick.points.toFixed(2)} pts` : '0 pts'}
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
        {actions.map(a => (
          <button key={a.result} onClick={a.fn}
            disabled={acting === pick.id || a.disabled}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors ${
              a.result === 'won'
                ? 'bg-green-500/20 hover:bg-green-500/40 text-green-400'
                : 'bg-red-500/20 hover:bg-red-500/40 text-red-400'
            }`}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
