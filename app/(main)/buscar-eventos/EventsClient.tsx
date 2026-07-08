'use client'
import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react'
import { OddsCard } from '@/components/odds/OddsCard'
import { ManualSelectionSlip } from '@/components/odds/ManualSelectionSlip'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { FEATURED_SPORTS } from '@/lib/services/odds.service'
import type { NormalizedEvent, PickSelection } from '@/types/odds'

interface EventsClientProps {
  isLoggedIn: boolean
}

const DATE_FILTERS = [
  { label: 'Hoy', value: 'today' },
  { label: 'Mañana', value: 'tomorrow' },
  { label: '7 días', value: '7days' },
  { label: '30 días', value: '30days' },
  { label: 'Todo', value: 'all' },
]

export function EventsClient({ isLoggedIn }: EventsClientProps) {
  const [events, setEvents] = useState<NormalizedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSports, setSelectedSports] = useState<string[]>(
    ['soccer_fifa_world_cup', 'soccer_uefa_champs_league', 'soccer_spain_la_liga']
  )
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('30days')
  const [minOdds, setMinOdds] = useState('')
  const [maxOdds, setMaxOdds] = useState('')
  const [hideStarted, setHideStarted] = useState(true)
  const [picks, setPicks] = useState<PickSelection[]>([])

  async function loadEvents() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/odds/events?sports=${selectedSports.join(',')}`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setEvents(data)
    } catch {
      setError('No se han podido cargar cuotas reales ahora mismo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadEvents() }, [selectedSports.join(',')])

  const filtered = useMemo(() => {
    const now = new Date()
    const cutoff = new Date()
    if (dateFilter === 'today') cutoff.setHours(23, 59, 59)
    else if (dateFilter === 'tomorrow') { cutoff.setDate(cutoff.getDate() + 1); cutoff.setHours(23, 59, 59) }
    else if (dateFilter === '7days') cutoff.setDate(cutoff.getDate() + 7)
    else if (dateFilter === '30days') cutoff.setDate(cutoff.getDate() + 30)
    else cutoff.setFullYear(cutoff.getFullYear() + 2) // 'all'

    return events.filter(e => {
      const t = new Date(e.commence_time)
      if (t > cutoff) return false
      if (hideStarted && t < now) return false
      if (search) {
        const q = search.toLowerCase()
        if (!e.event_name.toLowerCase().includes(q) && !e.league.toLowerCase().includes(q)) return false
      }
      const bestOdd = Math.max(
        e.best_odds.home ?? 0,
        e.best_odds.draw ?? 0,
        e.best_odds.away ?? 0
      )
      if (minOdds && bestOdd < parseFloat(minOdds)) return false
      if (maxOdds && bestOdd > parseFloat(maxOdds)) return false
      return true
    })
  }, [events, search, dateFilter, minOdds, maxOdds, hideStarted])

  function toggleSport(key: string) {
    setSelectedSports(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key].slice(0, 5)
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar filtros */}
      <aside className="lg:w-56 shrink-0">
        <div className="rounded-xl border border-superficie-hover bg-superficie/50 p-4 sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-semibold text-white">Filtros</span>
          </div>

          {/* Deportes */}
          <div className="mb-4">
            <p className="text-xs text-texto-secundario uppercase tracking-wider mb-2">Deporte / Liga</p>
            <div className="space-y-1.5">
              {FEATURED_SPORTS.map(s => (
                <label key={s.key} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSports.includes(s.key)}
                    onChange={() => toggleSport(s.key)}
                    className="w-3.5 h-3.5 accent-teal-500"
                  />
                  <span className="text-xs text-texto-secundario group-hover:text-texto transition-colors">
                    {s.emoji} {s.label}
                  </span>
                </label>
              ))}
            </div>
            {selectedSports.length >= 5 && (
              <p className="text-xs text-orange-400/70 mt-1">Máx. 5 deportes por consulta</p>
            )}
          </div>

          {/* Fecha */}
          <div className="mb-4">
            <p className="text-xs text-texto-secundario uppercase tracking-wider mb-2">Fecha</p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-2">
              {DATE_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setDateFilter(f.value)}
                  className={`text-xs py-1.5 rounded-md transition-colors ${
                    dateFilter === f.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-superficie-hover text-texto-secundario hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cuotas */}
          <div className="mb-4">
            <p className="text-xs text-texto-secundario uppercase tracking-wider mb-2">Cuota</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minOdds}
                onChange={e => setMinOdds(e.target.value)}
                className="w-full rounded-md border border-superficie-hover bg-superficie-hover px-2 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                step="0.1" min="1"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxOdds}
                onChange={e => setMaxOdds(e.target.value)}
                className="w-full rounded-md border border-superficie-hover bg-superficie-hover px-2 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                step="0.1" min="1"
              />
            </div>
          </div>

          {/* Opciones */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hideStarted}
              onChange={e => setHideStarted(e.target.checked)}
              className="w-3.5 h-3.5 accent-teal-500"
            />
            <span className="text-xs text-texto-secundario">Ocultar empezados</span>
          </label>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-texto-secundario" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar equipo, jugador o liga..."
            className="w-full rounded-xl border border-superficie-hover bg-superficie-hover/60 pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-texto-secundario">
            {loading ? 'Cargando...' : `${filtered.length} eventos`}
          </p>
          <button
            onClick={loadEvents}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-texto-secundario hover:text-teal-400 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 mb-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-400 shrink-0" />
            <p className="text-sm text-orange-300">{error}</p>
          </div>
        )}

        {/* Events grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Sin eventos"
            description="No hay eventos con los filtros actuales. Prueba a cambiar el rango de fechas o los deportes."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(event => (
              <OddsCard
                key={event.id}
                event={event}
                selectedPicks={picks}
                onAddPick={pick => setPicks(prev => [...prev.filter(p => p.event_id !== pick.event_id), pick])}
                onRemovePick={id => setPicks(prev => prev.filter(p => p.event_id !== id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selection slip */}
      <ManualSelectionSlip
        picks={picks}
        onRemove={id => setPicks(prev => prev.filter(p => p.event_id !== id))}
        onClear={() => setPicks([])}
        isLoggedIn={isLoggedIn}
      />
    </div>
  )
}
