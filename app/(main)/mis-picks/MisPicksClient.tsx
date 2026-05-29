'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check, X, Clock, Trophy, Search, ChevronDown, ChevronUp } from 'lucide-react'

interface Pick {
  id: string
  description: string
  competition: string | null
  selection: string
  odds: number
  stake: number
  status: 'pending' | 'won' | 'lost' | 'void'
  profit: number | null
  note: string | null
  match_date: string | null
  created_at: string
}

interface OddsEvent {
  id: string
  event_name: string
  league: string
  commence_time: string
  home_team: string
  away_team: string
  best_odds: { home: number | null; draw: number | null; away: number | null }
}

interface Props {
  picks: Pick[]
  bankroll: number
  userId: string
}

const STARTING = 1000

function fmt(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

type Mode = 'select' | 'manual'

export function MisPicksClient({ picks, bankroll }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [mode, setMode] = useState<Mode>('select')
  const [loading, setLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(false)
  const [events, setEvents] = useState<OddsEvent[]>([])
  const [eventSearch, setEventSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<OddsEvent | null>(null)
  const [form, setForm] = useState({
    description: '', competition: '', selection: '', odds: '', stake: '', note: '', match_date: '',
  })

  const profit = bankroll - STARTING
  const pending = picks.filter(p => p.status === 'pending')
  const resolved = picks.filter(p => p.status !== 'pending')

  async function loadEvents() {
    setEventsLoading(true)
    try {
      const res = await fetch('/api/odds/events')
      const data = await res.json()
      setEvents(data)
    } finally {
      setEventsLoading(false)
    }
  }

  function openForm() {
    setShowForm(true)
    setMode('select')
    setSelectedEvent(null)
    setForm({ description: '', competition: '', selection: '', odds: '', stake: '', note: '', match_date: '' })
    if (events.length === 0) loadEvents()
  }

  function selectEvent(ev: OddsEvent) {
    setSelectedEvent(ev)
    setForm(f => ({
      ...f,
      description: ev.event_name,
      competition: ev.league,
      match_date: ev.commence_time.slice(0, 16),
    }))
  }

  function selectOutcome(label: string, odds: number) {
    setForm(f => ({ ...f, selection: label, odds: odds.toFixed(2) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: form.description,
        competition: form.competition || null,
        selection: form.selection,
        odds: parseFloat(form.odds),
        stake: parseFloat(form.stake),
        note: form.note || null,
        match_date: form.match_date || null,
      }),
    })
    setLoading(false)
    if (res.ok) {
      setShowForm(false)
      router.refresh()
    }
  }

  async function resolve(id: string, result: 'won' | 'lost') {
    await fetch(`/api/picks/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    router.refresh()
  }

  const filteredEvents = events.filter(ev =>
    !eventSearch || ev.event_name.toLowerCase().includes(eventSearch.toLowerCase()) || ev.league.toLowerCase().includes(eventSearch.toLowerCase())
  ).slice(0, 20)

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis picks 🎯</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xl font-bold text-white">{fmt(bankroll)}</span>
            <span className={`text-sm font-medium ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profit >= 0 ? '+' : ''}{fmt(profit)}
            </span>
          </div>
        </div>
        <button
          onClick={openForm}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo pick
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-yellow-500/30 bg-slate-900 p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Nuevo pick</h2>
            <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs">
              <button type="button" onClick={() => setMode('select')} className={`px-3 py-1.5 transition-colors ${mode === 'select' ? 'bg-yellow-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}>
                📅 Elegir evento
              </button>
              <button type="button" onClick={() => setMode('manual')} className={`px-3 py-1.5 transition-colors ${mode === 'manual' ? 'bg-yellow-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}>
                ✏️ Manual
              </button>
            </div>
          </div>

          {/* Event selector */}
          {mode === 'select' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                  placeholder="Buscar partido..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              {eventsLoading ? (
                <p className="text-slate-500 text-sm text-center py-4">Cargando partidos...</p>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {filteredEvents.map(ev => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => selectEvent(ev)}
                      className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                        selectedEvent?.id === ev.id
                          ? 'border-yellow-500/50 bg-yellow-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-white text-sm font-medium">{ev.event_name}</p>
                          <p className="text-slate-500 text-xs">{ev.league} · {new Date(ev.commence_time).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        {selectedEvent?.id === ev.id && <Check className="h-4 w-4 text-yellow-400 shrink-0" />}
                      </div>
                    </button>
                  ))}
                  {filteredEvents.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">No hay partidos disponibles ahora mismo</p>
                  )}
                </div>
              )}

              {/* Outcome selector once event is picked */}
              {selectedEvent && (
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 space-y-2">
                  <p className="text-xs text-slate-400 font-medium mb-2">¿Qué apuestas?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedEvent.best_odds.home && (
                      <button
                        type="button"
                        onClick={() => selectOutcome(`${selectedEvent.home_team} gana`, selectedEvent.best_odds.home!)}
                        className={`rounded-lg border px-2 py-2 text-xs transition-colors text-center ${
                          form.selection === `${selectedEvent.home_team} gana`
                            ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                        }`}
                      >
                        <div className="font-semibold truncate">{selectedEvent.home_team.split(' ').slice(-1)}</div>
                        <div className="text-yellow-400 font-bold mt-0.5">{selectedEvent.best_odds.home.toFixed(2)}</div>
                      </button>
                    )}
                    {selectedEvent.best_odds.draw && (
                      <button
                        type="button"
                        onClick={() => selectOutcome('Empate', selectedEvent.best_odds.draw!)}
                        className={`rounded-lg border px-2 py-2 text-xs transition-colors text-center ${
                          form.selection === 'Empate'
                            ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                        }`}
                      >
                        <div className="font-semibold">Empate</div>
                        <div className="text-yellow-400 font-bold mt-0.5">{selectedEvent.best_odds.draw.toFixed(2)}</div>
                      </button>
                    )}
                    {selectedEvent.best_odds.away && (
                      <button
                        type="button"
                        onClick={() => selectOutcome(`${selectedEvent.away_team} gana`, selectedEvent.best_odds.away!)}
                        className={`rounded-lg border px-2 py-2 text-xs transition-colors text-center ${
                          form.selection === `${selectedEvent.away_team} gana`
                            ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                        }`}
                      >
                        <div className="font-semibold truncate">{selectedEvent.away_team.split(' ').slice(-1)}</div>
                        <div className="text-yellow-400 font-bold mt-0.5">{selectedEvent.best_odds.away.toFixed(2)}</div>
                      </button>
                    )}
                  </div>
                  {form.selection && (
                    <p className="text-xs text-teal-400 mt-1">✓ {form.selection} @ {form.odds}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Manual mode */}
          {mode === 'manual' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Partido *</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Real Madrid vs Barça" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Competición</label>
                <input value={form.competition} onChange={e => setForm(f => ({ ...f, competition: e.target.value }))} placeholder="La Liga" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fecha</label>
                <input type="datetime-local" value={form.match_date} onChange={e => setForm(f => ({ ...f, match_date: e.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Tu selección *</label>
                <input value={form.selection} onChange={e => setForm(f => ({ ...f, selection: e.target.value }))} placeholder="Real Madrid gana" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Cuota *</label>
                <input type="number" step="0.01" min="1.01" value={form.odds} onChange={e => setForm(f => ({ ...f, odds: e.target.value }))} placeholder="1.85" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none" required />
              </div>
            </div>
          )}

          {/* Stake (always shown once selection is made) */}
          {(mode === 'manual' || form.selection) && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">¿Cuánto apuestas? (€ ficticio) *</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, Math.floor(bankroll))}
                  value={form.stake}
                  onChange={e => setForm(f => ({ ...f, stake: e.target.value }))}
                  placeholder="50"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-slate-600 mt-1">Bankroll disponible: {fmt(bankroll)}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nota (opcional)</label>
                <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Por qué te gusta este pick..." className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none" />
              </div>
              {form.odds && form.stake && (
                <div className="text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
                  Si aciertas: <span className="text-green-400 font-semibold">+{fmt(parseFloat(form.stake) * (parseFloat(form.odds) - 1))}</span>
                  {' '}· Si fallas: <span className="text-red-400 font-semibold">-{fmt(parseFloat(form.stake))}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading || !form.description || !form.selection || !form.odds || !form.stake}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-slate-950 font-black py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Publicando...' : 'Publicar pick 🎯'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Pending picks */}
      {pending.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Pendientes ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(pick => <PickCard key={pick.id} pick={pick} onResolve={resolve} />)}
          </div>
        </section>
      )}

      {/* Resolved picks */}
      {resolved.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Historial ({resolved.length})
          </h2>
          <div className="space-y-3">
            {resolved.map(pick => <PickCard key={pick.id} pick={pick} />)}
          </div>
        </section>
      )}

      {picks.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-4">🐟</p>
          <p className="text-lg text-white font-medium mb-1">Sin picks todavía</p>
          <p className="text-sm">Tienes €1.000 ficticios. No los desperdicies en el Almería.</p>
        </div>
      )}
    </main>
  )
}

function PickCard({ pick, onResolve }: { pick: Pick; onResolve?: (id: string, r: 'won' | 'lost') => void }) {
  const potentialWin = pick.stake * (pick.odds - 1)
  const isPending = pick.status === 'pending'

  return (
    <div className={`rounded-xl border p-4 ${
      pick.status === 'won' ? 'border-green-500/30 bg-green-500/5' :
      pick.status === 'lost' ? 'border-red-500/20 bg-red-500/5' :
      'border-slate-800 bg-slate-900/50'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {pick.competition && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{pick.competition}</span>}
            {pick.match_date && <span className="text-xs text-slate-500">{new Date(pick.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
          </div>
          <p className="text-white font-medium">{pick.description}</p>
          <p className="text-yellow-400 text-sm mt-0.5">→ {pick.selection}</p>
          {pick.note && <p className="text-slate-500 text-xs mt-1 italic">"{pick.note}"</p>}
        </div>
        <div className="text-right shrink-0">
          <div className="text-white font-bold">{pick.odds.toFixed(2)}</div>
          <div className="text-slate-400 text-sm">{fmt(pick.stake)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
        <div className="text-xs text-slate-500">
          {isPending ? <>Si aciertas: <span className="text-green-400 font-medium">+{fmt(potentialWin)}</span></> :
           pick.status === 'won' ? <span className="text-green-400 font-semibold">+{fmt(pick.profit ?? 0)} ✓ acertaste</span> :
           pick.status === 'lost' ? <span className="text-red-400 font-semibold">{fmt(pick.profit ?? 0)} ✗ fallaste</span> : null}
        </div>
        {isPending && onResolve && (
          <div className="flex gap-2">
            <button onClick={() => onResolve(pick.id, 'won')} className="flex items-center gap-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors font-medium">
              <Check className="h-3 w-3" /> Acerté
            </button>
            <button onClick={() => onResolve(pick.id, 'lost')} className="flex items-center gap-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium">
              <X className="h-3 w-3" /> Fallé
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
