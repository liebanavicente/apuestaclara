'use client'
import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { FEATURED_SPORTS } from '@/lib/services/odds.service'
import type { NormalizedEvent, PickSelection } from '@/types/odds'

interface Props {
  balance: number
  onClose: () => void
  onCreated: () => void
}

export function NewSimulationModal({ balance, onClose, onCreated }: Props) {
  const [events, setEvents] = useState<NormalizedEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [selectedSport, setSelectedSport] = useState('soccer_fifa_world_cup')
  const [picks, setPicks] = useState<PickSelection[]>([])
  const [stake, setStake] = useState('10')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents(selectedSport)
  }, [selectedSport])

  async function loadEvents(sport: string) {
    setLoadingEvents(true)
    try {
      const res = await fetch(`/api/odds/events?sports=${sport}`)
      if (!res.ok) throw new Error()
      const data: NormalizedEvent[] = await res.json()
      setEvents(data.filter(e => new Date(e.commence_time) > new Date()))
    } catch {
      setEvents([])
    } finally {
      setLoadingEvents(false)
    }
  }

  function addPick(event: NormalizedEvent, outcome: 'home' | 'draw' | 'away') {
    const odds = event.best_odds[outcome]
    if (!odds) return
    const teamName = outcome === 'home' ? event.home_team : outcome === 'away' ? event.away_team : 'Empate'
    const pick: PickSelection = {
      event_id: event.id,
      event_name: event.event_name,
      sport_key: event.sport_key,
      sport_title: event.sport_title,
      league: event.league,
      commence_time: event.commence_time,
      market: '1X2',
      selection: `${outcome === 'home' ? '1' : outcome === 'away' ? '2' : 'X'} - ${teamName}`,
      odds,
      bookmaker: '',
      implied_probability: event.implied_probability[outcome] ?? 0,
    }
    setPicks(prev => [...prev.filter(p => p.event_id !== event.id), pick])
  }

  const totalOdds = picks.reduce((acc, p) => acc * p.odds, 1)
  const stakeNum = parseFloat(stake) || 0
  const potentialReturn = stakeNum * totalOdds

  async function handleSubmit() {
    if (picks.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/simulator/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picks, stake: stakeNum }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onCreated()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <h2 className="font-semibold text-white">Nueva simulación</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Sport selector */}
          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Competición</p>
            <div className="flex flex-wrap gap-1.5">
              {FEATURED_SPORTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSelectedSport(s.key)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    selectedSport === s.key
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Selecciona eventos</p>
            {loadingEvents ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando eventos...
              </div>
            ) : events.length === 0 ? (
              <p className="text-sm text-slate-600 py-4">No hay eventos disponibles para esta competición.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {events.map(event => {
                  const selected = picks.find(p => p.event_id === event.id)
                  return (
                    <div key={event.id} className={`rounded-lg border p-3 transition-colors ${selected ? 'border-teal-500/40 bg-teal-950/20' : 'border-slate-800 bg-slate-800/30'}`}>
                      <p className="text-xs font-medium text-white mb-2">{event.event_name}</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['home', 'draw', 'away'] as const).map(outcome => {
                          const odds = event.best_odds[outcome]
                          if (!odds) return null
                          const label = outcome === 'home' ? '1' : outcome === 'draw' ? 'X' : '2'
                          const isSelected = selected?.selection.startsWith(label + ' -') || false
                          return (
                            <button
                              key={outcome}
                              onClick={() => addPick(event, outcome)}
                              className={`text-xs py-1.5 rounded transition-colors ${
                                isSelected
                                  ? 'bg-teal-600 text-white font-bold'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              {label} · {odds.toFixed(2)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Selected picks summary */}
          {picks.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Selecciones ({picks.length})</p>
              <div className="space-y-1.5">
                {picks.map(pick => (
                  <div key={pick.event_id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs text-white truncate">{pick.event_name}</p>
                      <p className="text-xs text-slate-400">{pick.selection} · @{pick.odds.toFixed(2)}</p>
                    </div>
                    <button onClick={() => setPicks(prev => prev.filter(p => p.event_id !== pick.event_id))} className="text-slate-600 hover:text-red-400 ml-2 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0 space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2">
              <AlertCircle className="h-4 w-4 text-orange-400 shrink-0" />
              <p className="text-xs text-orange-300">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">Apuesta virtual (max {balance.toFixed(0)}€)</p>
              <input
                type="number"
                value={stake}
                onChange={e => setStake(e.target.value)}
                min="1" max={balance} step="1"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            {picks.length > 0 && (
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">Cuota total</p>
                <p className="text-lg font-black text-white">{totalOdds.toFixed(2)}</p>
                <p className="text-xs text-teal-400">Retorno: {potentialReturn.toFixed(2)}€</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={picks.length === 0 || stakeNum < 1 || stakeNum > balance || submitting}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {submitting ? 'Creando...' : `Simular ${picks.length > 1 ? 'combinada' : 'simple'}`}
          </button>
          <p className="text-xs text-slate-600 text-center">Dinero ficticio. Sin riesgo real.</p>
        </div>
      </div>
    </div>
  )
}
