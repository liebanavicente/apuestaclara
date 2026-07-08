'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check, X, Clock, Trophy, Search, Trash2 } from 'lucide-react'

interface Leg {
  description: string
  selection: string
  odds: number
}

interface Pick {
  id: string
  description: string
  competition: string | null
  selection: string
  odds: number
  status: 'pending' | 'won' | 'lost' | 'void'
  points: number
  note: string | null
  match_date: string | null
  created_at: string
  legs: Leg[] | null
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
  totalPoints: number
  userId: string
  importedLegs?: Leg[] | null
}

function fmtPts(n: number) {
  return n.toFixed(2)
}

type InputMode = 'select' | 'manual'
type PickType = 'single' | 'combinada'
type Market = 'result' | 'custom'

const INPUT_CLS = 'w-full rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm placeholder-texto-terciario focus:border-neon focus:outline-none'

export function MisPicksClient({ picks, totalPoints, importedLegs }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [pickType, setPickType] = useState<PickType>('single')
  const [inputMode, setInputMode] = useState<InputMode>('select')
  const [market, setMarket] = useState<Market>('result')
  const [loading, setLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(false)
  const [events, setEvents] = useState<OddsEvent[]>([])
  const [eventSearch, setEventSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<OddsEvent | null>(null)
  const [legs, setLegs] = useState<Leg[]>([])
  const [legForm, setLegForm] = useState({ description: '', selection: '', odds: '' })
  const [addingLeg, setAddingLeg] = useState<'event' | 'manual' | null>(null)
  const [legMarket, setLegMarket] = useState<Market>('result')
  const [legEvent, setLegEvent] = useState<OddsEvent | null>(null)
  const [form, setForm] = useState({ description: '', competition: '', selection: '', odds: '', note: '', match_date: '' })
  const [note, setNote] = useState('')

  const pending = picks.filter(p => p.status === 'pending')
  const resolved = picks.filter(p => p.status !== 'pending')
  const combinedOdds = legs.reduce((acc, l) => acc * l.odds, 1)

  useEffect(() => {
    if (importedLegs && importedLegs.length > 0) {
      setLegs(importedLegs)
      setPickType('combinada')
      setShowForm(true)
    }
  }, [importedLegs])

  async function loadEvents() {
    if (events.length > 0) return
    setEventsLoading(true)
    try {
      const res = await fetch('/api/odds/events')
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
    } finally {
      setEventsLoading(false)
    }
  }

  function openForm() {
    setShowForm(true)
    setPickType('single')
    setInputMode('select')
    setMarket('result')
    setSelectedEvent(null)
    setEventSearch('')
    setLegs([])
    setForm({ description: '', competition: '', selection: '', odds: '', note: '', match_date: '' })
    setNote('')
    loadEvents()
  }

  function selectEvent(ev: OddsEvent) {
    setSelectedEvent(ev)
    setMarket('result')
    setForm(f => ({ ...f, description: ev.event_name, competition: ev.league, match_date: ev.commence_time.slice(0, 16), selection: '', odds: '' }))
  }

  function selectOutcome(label: string, odds: number) {
    setForm(f => ({ ...f, selection: label, odds: odds.toFixed(2) }))
  }

  function selectLegEvent(ev: OddsEvent) {
    setLegEvent(ev)
    setLegMarket('result')
    setLegForm({ description: ev.event_name, selection: '', odds: '' })
  }

  function selectLegOutcome(label: string, odds: number) {
    setLegForm(f => ({ ...f, selection: label, odds: odds.toFixed(2) }))
  }

  function addLeg() {
    if (!legForm.description || !legForm.selection || !legForm.odds) return
    setLegs(prev => [...prev, { description: legForm.description, selection: legForm.selection, odds: parseFloat(legForm.odds) }])
    setLegForm({ description: '', selection: '', odds: '' })
    setLegEvent(null)
    setAddingLeg(null)
  }

  function removeLeg(i: number) {
    setLegs(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const isCombinada = pickType === 'combinada'
    const finalOdds = isCombinada ? Math.round(combinedOdds * 100) / 100 : parseFloat(form.odds)

    await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: isCombinada ? `Combinada ${legs.length} sel.` : form.description,
        competition: isCombinada ? null : (form.competition || null),
        selection: isCombinada ? legs.map(l => l.selection).join(' + ') : form.selection,
        odds: finalOdds,
        stake: 1,
        note: note || null,
        match_date: isCombinada ? null : (form.match_date || null),
        legs: isCombinada ? legs : null,
      }),
    })
    setLoading(false)
    setShowForm(false)
    router.refresh()
  }

  async function resolve(id: string, result: 'won' | 'lost') {
    await fetch(`/api/picks/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    router.refresh()
  }

  async function deletePick(id: string) {
    await fetch(`/api/picks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const filteredEvents = events.filter(ev =>
    !eventSearch ||
    ev.event_name.toLowerCase().includes(eventSearch.toLowerCase()) ||
    ev.league.toLowerCase().includes(eventSearch.toLowerCase())
  ).slice(0, 20)

  const singleReady = pickType === 'single' && !!form.description && !!form.selection && !!form.odds
  const combinadaReady = pickType === 'combinada' && legs.length >= 2
  const canSubmit = !loading && (singleReady || combinadaReady)

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Mis picks 🎯</h1>
          <p className="text-texto-secundario text-sm mt-0.5">
            <span className="text-neon font-black text-lg">{fmtPts(totalPoints)}</span>
            <span className="text-texto-secundario ml-1">pts acumulados</span>
          </p>
        </div>
        <button onClick={openForm} className="flex items-center gap-2 bg-neon hover:brightness-110 text-[#0B3D2E] font-black px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus className="h-4 w-4" /> Nuevo pick
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neon/30 bg-superficie p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Nuevo pick</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-texto-secundario hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          {/* Single / Combinada */}
          <div className="flex rounded-lg border border-superficie-hover overflow-hidden text-xs">
            <button type="button" onClick={() => setPickType('single')}
              className={`flex-1 px-3 py-2 transition-colors font-medium ${pickType === 'single' ? 'bg-neon text-[#0B3D2E] font-black' : 'text-texto-secundario hover:text-white'}`}>
              ⚽ Pick simple
            </button>
            <button type="button" onClick={() => { setPickType('combinada'); loadEvents() }}
              className={`flex-1 px-3 py-2 transition-colors font-medium ${pickType === 'combinada' ? 'bg-neon text-[#0B3D2E] font-black' : 'text-texto-secundario hover:text-white'}`}>
              🔗 Combinada
            </button>
          </div>

          {/* SINGLE */}
          {pickType === 'single' && (
            <>
              <div className="flex rounded-lg border border-superficie-hover overflow-hidden text-xs">
                <button type="button" onClick={() => { setInputMode('select'); loadEvents() }}
                  className={`flex-1 px-3 py-1.5 transition-colors ${inputMode === 'select' ? 'bg-superficie-hover text-white font-bold' : 'text-texto-secundario hover:text-white'}`}>
                  📅 Elegir partido
                </button>
                <button type="button" onClick={() => setInputMode('manual')}
                  className={`flex-1 px-3 py-1.5 transition-colors ${inputMode === 'manual' ? 'bg-superficie-hover text-white font-bold' : 'text-texto-secundario hover:text-white'}`}>
                  ✏️ Manual
                </button>
              </div>

              {inputMode === 'select' && (
                <EventSelector events={filteredEvents} loading={eventsLoading} search={eventSearch}
                  onSearch={setEventSearch} selectedId={selectedEvent?.id} onSelect={selectEvent} />
              )}
              {inputMode === 'select' && selectedEvent && (
                <MarketSelector event={selectedEvent} market={market} selection={form.selection}
                  onMarketChange={m => { setMarket(m); setForm(f => ({ ...f, selection: '', odds: '' })) }}
                  onSelectOutcome={selectOutcome}
                  customSelection={form.selection} customOdds={form.odds}
                  onCustomChange={(sel, odds) => setForm(f => ({ ...f, selection: sel, odds }))} />
              )}
              {inputMode === 'manual' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-texto-secundario mb-1 block">Partido *</label>
                    <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Real Madrid vs Barça" required className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="text-xs text-texto-secundario mb-1 block">Competición</label>
                    <input value={form.competition} onChange={e => setForm(f => ({ ...f, competition: e.target.value }))} placeholder="La Liga" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="text-xs text-texto-secundario mb-1 block">Fecha</label>
                    <input type="datetime-local" value={form.match_date} onChange={e => setForm(f => ({ ...f, match_date: e.target.value }))} className={INPUT_CLS} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-texto-secundario mb-1 block">Tu apuesta *</label>
                    <input value={form.selection} onChange={e => setForm(f => ({ ...f, selection: e.target.value }))} placeholder="Mbappé marca, Más de 2.5 goles…" required className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="text-xs text-texto-secundario mb-1 block">Cuota *</label>
                    <input type="number" step="0.01" min="1.01" value={form.odds} onChange={e => setForm(f => ({ ...f, odds: e.target.value }))} placeholder="1.85" required className={INPUT_CLS} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* COMBINADA */}
          {pickType === 'combinada' && (
            <div className="space-y-3">
              {legs.length > 0 && (
                <div className="space-y-2">
                  {legs.map((leg, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{leg.description}</p>
                        <p className="text-neon text-xs">→ {leg.selection}</p>
                      </div>
                      <span className="text-white font-bold text-sm shrink-0">{leg.odds.toFixed(2)}</span>
                      <button type="button" onClick={() => removeLeg(i)} className="text-texto-terciario hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs px-1">
                    <span className="text-texto-secundario">{legs.length} selecciones</span>
                    <span className="text-white font-black">Cuota: {combinedOdds.toFixed(2)} → <span className="text-neon">+{combinedOdds.toFixed(2)} pts si aciertas</span></span>
                  </div>
                </div>
              )}

              {addingLeg === null && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setAddingLeg('event'); setLegEvent(null); setLegForm({ description: '', selection: '', odds: '' }) }}
                    className="flex-1 border border-dashed border-superficie-hover hover:border-neon/50 text-texto-secundario hover:text-neon rounded-lg py-2 text-xs transition-colors">
                    + Partido real
                  </button>
                  <button type="button" onClick={() => { setAddingLeg('manual'); setLegForm({ description: '', selection: '', odds: '' }) }}
                    className="flex-1 border border-dashed border-superficie-hover hover:border-neon/50 text-texto-secundario hover:text-neon rounded-lg py-2 text-xs transition-colors">
                    + Manual
                  </button>
                </div>
              )}

              {addingLeg === 'event' && (
                <div className="rounded-lg border border-superficie-hover bg-superficie-hover/50 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-texto-secundario">Añadir selección</p>
                    <button type="button" onClick={() => setAddingLeg(null)} className="text-texto-secundario hover:text-white"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <EventSelector events={filteredEvents} loading={eventsLoading} search={eventSearch}
                    onSearch={setEventSearch} selectedId={legEvent?.id} onSelect={selectLegEvent} />
                  {legEvent && (
                    <MarketSelector event={legEvent} market={legMarket} selection={legForm.selection}
                      onMarketChange={m => { setLegMarket(m); setLegForm(f => ({ ...f, selection: '', odds: '' })) }}
                      onSelectOutcome={selectLegOutcome}
                      customSelection={legForm.selection} customOdds={legForm.odds}
                      onCustomChange={(sel, odds) => setLegForm(f => ({ ...f, selection: sel, odds }))} />
                  )}
                  {legForm.selection && legForm.odds && (
                    <button type="button" onClick={addLeg} className="w-full bg-neon hover:brightness-110 text-[#0B3D2E] font-black text-xs py-2 rounded-lg">
                      Confirmar selección
                    </button>
                  )}
                </div>
              )}

              {addingLeg === 'manual' && (
                <div className="rounded-lg border border-superficie-hover bg-superficie-hover/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-texto-secundario">Añadir manual</p>
                    <button type="button" onClick={() => setAddingLeg(null)} className="text-texto-secundario hover:text-white"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <input value={legForm.description} onChange={e => setLegForm(f => ({ ...f, description: e.target.value }))} placeholder="Partido" className={INPUT_CLS} />
                  <input value={legForm.selection} onChange={e => setLegForm(f => ({ ...f, selection: e.target.value }))} placeholder="Tu apuesta" className={INPUT_CLS} />
                  <input type="number" step="0.01" min="1.01" value={legForm.odds} onChange={e => setLegForm(f => ({ ...f, odds: e.target.value }))} placeholder="Cuota" className={INPUT_CLS} />
                  {legForm.description && legForm.selection && legForm.odds && (
                    <button type="button" onClick={addLeg} className="w-full bg-neon hover:brightness-110 text-[#0B3D2E] font-black text-xs py-2 rounded-lg">Confirmar</button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nota + preview puntos */}
          {(singleReady || combinadaReady) && (
            <div className="space-y-2 pt-1 border-t border-superficie-hover">
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Nota opcional…" className={INPUT_CLS} />
              <div className="text-xs bg-superficie-hover rounded-lg px-3 py-2 text-texto-secundario">
                Si aciertas: <span className="text-green-400 font-bold">+{(pickType === 'single' ? parseFloat(form.odds || '0') : combinedOdds).toFixed(2)} pts</span>
                {' '}· Si fallas: <span className="text-texto-secundario">0 pts</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={!canSubmit}
              className="flex-1 bg-neon hover:brightness-110 disabled:opacity-40 text-[#0B3D2E] font-black py-2.5 rounded-lg text-sm transition-colors">
              {loading ? 'Publicando…' : 'Publicar pick 🎯'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-superficie-hover text-texto-secundario hover:text-white text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Pendientes */}
      {pending.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-texto-secundario uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Pendientes ({pending.length})
          </h2>
          <div className="space-y-2.5">
            {pending.map(p => <PickCard key={p.id} pick={p} onResolve={resolve} onDelete={deletePick} />)}
          </div>
        </section>
      )}

      {/* Historial */}
      {resolved.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-texto-secundario uppercase tracking-widest mb-3 flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5" /> Historial ({resolved.length})
          </h2>
          <div className="space-y-2.5">
            {resolved.map(p => <PickCard key={p.id} pick={p} />)}
          </div>
        </section>
      )}

      {picks.length === 0 && !showForm && (
        <div className="text-center py-16 text-texto-secundario">
          <p className="text-4xl mb-3">🐟</p>
          <p className="text-white font-medium mb-1">Sin picks todavía</p>
          <p className="text-sm">Cada acierto suma la cuota en puntos</p>
        </div>
      )}
    </main>
  )
}

function EventSelector({ events, loading, search, onSearch, selectedId, onSelect }: {
  events: OddsEvent[]; loading: boolean; search: string
  onSearch: (s: string) => void; selectedId?: string; onSelect: (ev: OddsEvent) => void
}) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-texto-secundario" />
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Buscar partido…"
          className="w-full rounded-lg border border-superficie-hover bg-superficie-hover pl-9 pr-3 py-2 text-white text-sm placeholder-texto-terciario focus:border-neon focus:outline-none" />
      </div>
      {loading ? <p className="text-texto-secundario text-xs text-center py-3">Cargando…</p> : (
        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
          {events.map(ev => (
            <button key={ev.id} type="button" onClick={() => onSelect(ev)}
              className={`w-full text-left rounded-lg border px-3 py-2 transition-colors text-xs ${selectedId === ev.id ? 'border-neon/50 bg-neon/10' : 'border-superficie-hover bg-superficie-hover hover:border-neon'}`}>
              <p className="text-white font-medium">{ev.event_name}</p>
              <p className="text-texto-secundario">{ev.league} · {new Date(ev.commence_time).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            </button>
          ))}
          {events.length === 0 && <p className="text-texto-secundario text-xs text-center py-3">Sin partidos</p>}
        </div>
      )}
    </div>
  )
}

function MarketSelector({ event, market, selection, onMarketChange, onSelectOutcome, customSelection, customOdds, onCustomChange }: {
  event: OddsEvent; market: Market; selection: string
  onMarketChange: (m: Market) => void; onSelectOutcome: (l: string, o: number) => void
  customSelection: string; customOdds: string; onCustomChange: (s: string, o: string) => void
}) {
  return (
    <div className="rounded-lg border border-superficie-hover bg-superficie-hover p-3 space-y-2">
      <div className="flex rounded-md border border-superficie-hover overflow-hidden text-xs mb-2">
        <button type="button" onClick={() => onMarketChange('result')}
          className={`flex-1 px-2 py-1 transition-colors ${market === 'result' ? 'bg-superficie-hover text-white font-bold' : 'text-texto-secundario hover:text-white'}`}>⚽ 1X2</button>
        <button type="button" onClick={() => onMarketChange('custom')}
          className={`flex-1 px-2 py-1 transition-colors ${market === 'custom' ? 'bg-superficie-hover text-white font-bold' : 'text-texto-secundario hover:text-white'}`}>🎲 Otro</button>
      </div>
      {market === 'result' && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: event.home_team.split(' ').pop()!, full: `${event.home_team} gana`, odds: event.best_odds.home },
            { label: 'X', full: 'Empate', odds: event.best_odds.draw },
            { label: event.away_team.split(' ').pop()!, full: `${event.away_team} gana`, odds: event.best_odds.away },
          ].map(({ label, full, odds }) => odds ? (
            <button key={full} type="button" onClick={() => onSelectOutcome(full, odds)}
              className={`rounded-lg border px-2 py-2 text-xs text-center transition-colors ${selection === full ? 'border-neon/50 bg-neon/10 text-neon' : 'border-superficie-hover hover:border-neon text-texto-secundario'}`}>
              <div className="font-semibold truncate">{label}</div>
              <div className="text-neon font-black mt-0.5">{odds.toFixed(2)}</div>
            </button>
          ) : null)}
        </div>
      )}
      {market === 'custom' && (
        <div className="space-y-2">
          <input value={customSelection} onChange={e => onCustomChange(e.target.value, customOdds)} placeholder="Mbappé marca, Más de 2.5 goles…" className={INPUT_CLS} />
          <input type="number" step="0.01" min="1.01" value={customOdds} onChange={e => onCustomChange(customSelection, e.target.value)} placeholder="Cuota" className={INPUT_CLS} />
        </div>
      )}
      {selection && <p className="text-xs text-teal-400">✓ {selection}</p>}
    </div>
  )
}

function PickCard({ pick, onResolve, onDelete }: { pick: Pick; onResolve?: (id: string, r: 'won' | 'lost') => void; onDelete?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const isPending = pick.status === 'pending'
  const isCombinada = pick.legs && pick.legs.length > 0

  return (
    <div className={`rounded-xl border p-3.5 ${
      pick.status === 'won' ? 'border-green-500/30 bg-green-500/5' :
      pick.status === 'lost' ? 'border-red-500/20 bg-red-500/5' :
      'border-superficie-hover bg-superficie/50'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isCombinada && <span className="text-xs bg-neon/20 text-neon px-2 py-0.5 rounded-full font-medium">🔗 {pick.legs!.length} sel.</span>}
            {pick.competition && !isCombinada && <span className="text-xs bg-superficie-hover text-texto-secundario px-2 py-0.5 rounded-full">{pick.competition}</span>}
            {pick.match_date && !isCombinada && <span className="text-xs text-texto-secundario">{new Date(pick.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
          </div>
          <p className="text-white font-medium text-sm">{pick.description}</p>
          {!isCombinada && <p className="text-neon text-xs mt-0.5">→ {pick.selection}</p>}
          {isCombinada && (
            <button type="button" onClick={() => setExpanded(!expanded)} className="text-xs text-texto-secundario hover:text-texto mt-0.5">
              {expanded ? '▲ Ocultar' : '▼ Ver selecciones'}
            </button>
          )}
          {isCombinada && expanded && (
            <div className="mt-2 space-y-1">
              {pick.legs!.map((leg, i) => (
                <div key={i} className="text-xs text-texto-secundario flex gap-2">
                  <span className="text-neon/60 shrink-0">{leg.odds.toFixed(2)}</span>
                  <span className="truncate">{leg.description} → <span className="text-texto-secundario">{leg.selection}</span></span>
                </div>
              ))}
            </div>
          )}
          {pick.note && <p className="text-texto-secundario text-xs mt-1 italic">"{pick.note}"</p>}
        </div>
        <div className="text-right shrink-0">
          <div className="text-white font-bold">{pick.odds.toFixed(2)}</div>
          <div className="text-xs text-texto-secundario">cuota</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-superficie-hover/50">
        <div className="text-xs">
          {isPending
            ? <span className="text-texto-secundario">Si aciertas: <span className="text-green-400 font-medium">+{pick.odds.toFixed(2)} pts</span></span>
            : pick.status === 'won'
            ? <span className="text-green-400 font-semibold">+{fmtPts(pick.points)} pts ✓</span>
            : <span className="text-texto-secundario">0 pts ✗</span>}
        </div>
        {isPending && (
          <div className="flex gap-2">
            {onResolve && <>
              <button onClick={() => onResolve(pick.id, 'won')} className="flex items-center gap-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg font-medium">
                <Check className="h-3 w-3" /> Acerté
              </button>
              <button onClick={() => onResolve(pick.id, 'lost')} className="flex items-center gap-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg font-medium">
                <X className="h-3 w-3" /> Fallé
              </button>
            </>}
            {onDelete && (
              <button onClick={() => onDelete(pick.id)} className="flex items-center gap-1 text-xs text-texto-terciario hover:text-red-400 px-2 py-1.5 rounded-lg transition-colors ml-auto">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
