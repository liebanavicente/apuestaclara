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

  const [fixLoading, setFixLoading] = useState(false)
  const [fixResult, setFixResult] = useState<any>(null)

  async function runAuto() {
    setAutoLoading(true)
    setAutoResult(null)
    const res = await fetch('/api/admin/auto-resolve', { method: 'POST' })
    setAutoResult(await res.json())
    setAutoLoading(false)
    loadAll()
  }

  async function fixOdds() {
    setFixLoading(true)
    setFixResult(null)
    const res = await fetch('/api/admin/fix-odds', { method: 'POST' })
    setFixResult(await res.json())
    setFixLoading(false)
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
      <h1 className="text-2xl font-black text-ink mb-1">Resolver picks</h1>
      <p className="text-ink-3 text-sm mb-6">Resolución automática y manual. Puedes corregir picks ya resueltos.</p>

      <div className="flex gap-2 mb-2 flex-wrap">
        <button onClick={runAuto} disabled={autoLoading}
          className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-colors">
          {autoLoading ? 'Resolviendo…' : '▶ Auto-resolver'}
        </button>
        <button onClick={fixOdds} disabled={fixLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black px-5 py-2.5 rounded-xl transition-colors">
          {fixLoading ? 'Rectificando…' : '🔧 Rectificar cuotas'}
        </button>
      </div>

      {autoResult && (
        <div className="mb-4 rounded-xl gb-card p-3 text-sm">
          <span className="text-green-600 font-bold">{autoResult.totalResolved} resueltos</span>
          {autoResult.log?.map((l: string, i: number) => <p key={i} className="text-ink-3 text-xs mt-0.5 font-mono">{l}</p>)}
        </div>
      )}

      {fixResult && (
        <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm">
          <span className="text-blue-600 font-bold">✓ {fixResult.updated} picks actualizados</span>
          <span className="text-ink-3 ml-2">({fixResult.skipped} sin cambios, {fixResult.total} total)</span>
        </div>
      )}

      {/* Pendientes */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-3">Pendientes ({pending.length})</h2>
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
          <h2 className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-3">Resueltos hoy — corregir si hace falta ({resolved.length})</h2>
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
        <p className="text-ink-3 text-sm">Sin picks pendientes ni resueltos hoy.</p>
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
      'border-black/[0.06] bg-white/70'
    }`}>
      <div className="flex-1 min-w-0">
        <p className="text-ink text-sm font-medium truncate">{pick.description}</p>
        <p className="text-amber-600 text-xs">→ {pick.selection} @ {pick.odds.toFixed(2)}</p>
        <p className="text-ink-3 text-xs">{pick.username}
          {pick.status !== 'pending' && (
            <span className={`ml-2 ${pick.status === 'won' ? 'text-green-600' : 'text-red-600'}`}>
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
                ? 'bg-green-500/20 hover:bg-green-500/40 text-green-600'
                : 'bg-red-500/20 hover:bg-red-500/40 text-red-600'
            }`}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
