'use client'
import { useEffect, useState } from 'react'

export default function AdminResolverPage() {
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <main className="max-w-xl mx-auto px-4 py-12 space-y-12">
      <div>
        <h1 className="text-2xl font-black text-white mb-2">Auto-resolver picks</h1>
        <p className="text-texto-secundario text-sm mb-8">
          Consulta los resultados completados en The Odds API y resuelve automáticamente todos los picks pendientes.
          El cron lo hace cada hora solo, pero puedes forzarlo aquí.
        </p>

        <button onClick={run} disabled={loading}
          className="bg-neon hover:brightness-110 disabled:opacity-50 text-white font-black px-6 py-3 rounded-xl transition-colors">
          {loading ? 'Resolviendo…' : '▶ Ejecutar ahora'}
        </button>

        {result && (
          <div className="mt-6 rounded-xl border border-superficie-hover bg-superficie p-5">
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-2xl font-black text-green-400">{result.totalResolved}</p>
                <p className="text-xs text-texto-secundario">picks resueltos</p>
              </div>
              <div>
                <p className="text-2xl font-black text-red-400">{result.totalFailed}</p>
                <p className="text-xs text-texto-secundario">errores</p>
              </div>
            </div>
            {result.log?.length > 0 && (
              <div className="text-xs text-texto-secundario space-y-1 font-mono max-h-64 overflow-y-auto">
                {result.log.map((line: string, i: number) => <p key={i}>{line}</p>)}
              </div>
            )}
            {result.log?.length === 0 && (
              <p className="text-texto-secundario text-sm">Sin picks pendientes que resolver.</p>
            )}
          </div>
        )}
      </div>

      <PorraFinalAdmin />
    </main>
  )
}

function PorraFinalAdmin() {
  const [loading, setLoading] = useState(true)
  const [opponentName, setOpponentName] = useState('')
  const [opponentFlag, setOpponentFlag] = useState('')
  const [goalsSpain, setGoalsSpain] = useState('')
  const [goalsRival, setGoalsRival] = useState('')
  const [penaltyWinner, setPenaltyWinner] = useState<'espana' | 'rival' | ''>('')
  const [pendingCount, setPendingCount] = useState(0)
  const [resolvedAt, setResolvedAt] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/porra-final')
      .then(r => r.json())
      .then(data => {
        setOpponentName(data.matchInfo?.opponent_name ?? '')
        setOpponentFlag(data.matchInfo?.opponent_flag ?? '')
        setResolvedAt(data.matchInfo?.resolved_at ?? null)
        setPendingCount(data.pendingCount ?? 0)
      })
      .finally(() => setLoading(false))
  }, [])

  async function saveOpponent() {
    setSaving(true)
    setMsg(null)
    const res = await fetch('/api/admin/porra-final', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'set_opponent', opponent_name: opponentName, opponent_flag: opponentFlag }),
    })
    const data = await res.json()
    setMsg(res.ok ? 'Rival actualizado ✓' : data.error)
    setSaving(false)
  }

  async function resolve() {
    if (goalsSpain === '' || goalsRival === '') {
      setMsg('Indica el marcador real')
      return
    }
    setSaving(true)
    setMsg(null)
    const res = await fetch('/api/admin/porra-final', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'resolve',
        actual_goals_spain: Number(goalsSpain),
        actual_goals_rival: Number(goalsRival),
        actual_penalty_winner: penaltyWinner || null,
      }),
    })
    const data = await res.json()
    setMsg(res.ok ? `Resueltos ${data.resolved}/${data.total} pronósticos ✓` : data.error)
    setSaving(false)
  }

  if (loading) return null

  return (
    <div>
      <h2 className="text-xl font-black text-white mb-2">🇪🇸 Porra de la final</h2>
      <p className="text-texto-secundario text-sm mb-6">
        {pendingCount} pronóstico(s) pendiente(s) de resolver.
        {resolvedAt && <span className="text-neon"> Ya resuelta el {new Date(resolvedAt).toLocaleString('es-ES')}.</span>}
      </p>

      <div className="rounded-xl border border-superficie-hover bg-superficie p-5 space-y-4">
        <div>
          <p className="text-xs text-texto-secundario mb-2 uppercase tracking-wider">Rival confirmado</p>
          <div className="flex gap-2">
            <input value={opponentFlag} onChange={e => setOpponentFlag(e.target.value)} placeholder="🇦🇷"
              className="w-20 rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm" />
            <input value={opponentName} onChange={e => setOpponentName(e.target.value)} placeholder="Nombre del rival"
              className="flex-1 rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm" />
            <button onClick={saveOpponent} disabled={saving}
              className="bg-amarillo text-[#0B1E3F] font-black px-4 py-2 rounded-lg text-sm disabled:opacity-50">
              Guardar
            </button>
          </div>
        </div>

        <hr className="border-superficie-hover" />

        <div>
          <p className="text-xs text-texto-secundario mb-2 uppercase tracking-wider">
            Resultado real (tras prórroga, antes de penaltis) — resuelve todos los pronósticos pendientes
          </p>
          <div className="flex items-center gap-2 mb-2">
            <input type="number" min={0} max={9} value={goalsSpain} onChange={e => setGoalsSpain(e.target.value)}
              placeholder="España" className="w-20 rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm" />
            <span className="text-texto-secundario">–</span>
            <input type="number" min={0} max={9} value={goalsRival} onChange={e => setGoalsRival(e.target.value)}
              placeholder="Rival" className="w-20 rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm" />
            <select value={penaltyWinner} onChange={e => setPenaltyWinner(e.target.value as 'espana' | 'rival' | '')}
              className="rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm">
              <option value="">Sin penaltis</option>
              <option value="espana">Penaltis: España</option>
              <option value="rival">Penaltis: Rival</option>
            </select>
          </div>
          <button onClick={resolve} disabled={saving}
            className="bg-rojo hover:brightness-110 disabled:opacity-50 text-white font-black px-6 py-3 rounded-xl transition-all">
            {saving ? 'Resolviendo…' : 'Registrar resultado y resolver'}
          </button>
        </div>

        {msg && <p className="text-sm text-white">{msg}</p>}
      </div>
    </div>
  )
}
