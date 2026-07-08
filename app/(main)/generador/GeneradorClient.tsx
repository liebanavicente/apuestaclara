'use client'
import { useState } from 'react'
import { TrendingUp, Shuffle, Settings2, ChevronRight, AlertCircle, Lock, Brain, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { OddsCard } from '@/components/odds/OddsCard'
import { ManualSelectionSlip } from '@/components/odds/ManualSelectionSlip'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { AnalysisResults } from '@/components/generator/AnalysisResults'
import { FEATURED_SPORTS } from '@/lib/services/odds.service'
import { formatOdds, totalOdds } from '@/lib/utils'
import type { NormalizedEvent, PickSelection } from '@/types/odds'
import type { CombinedAnalysis } from '@/types/ai'

interface GeneradorClientProps {
  isLoggedIn: boolean
  maxPicks: number
  isPremium: boolean
}

type Mode = 'manual' | 'auto'
type RiskLevel = 'bajo' | 'medio' | 'alto'

export function GeneradorClient({ isLoggedIn, maxPicks, isPremium }: GeneradorClientProps) {
  const [mode, setMode] = useState<Mode>('auto')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medio')
  const [targetOdds, setTargetOdds] = useState('5.00')
  const [numPicks, setNumPicks] = useState(Math.min(3, maxPicks))
  const [selectedSports, setSelectedSports] = useState<string[]>(['soccer_fifa_world_cup', 'soccer_uefa_champs_league'])
  const [events, setEvents] = useState<NormalizedEvent[]>([])
  const [picks, setPicks] = useState<PickSelection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CombinedAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  async function loadEvents() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/odds/events?sports=${selectedSports.join(',')}`)
      if (!res.ok) throw new Error()
      const data: NormalizedEvent[] = await res.json()
      setEvents(data.filter(e => new Date(e.commence_time) > new Date()))
    } catch {
      setError('No se han podido cargar cuotas reales ahora mismo.')
    } finally {
      setLoading(false)
    }
  }

  function autoGenerate(eventsToUse: NormalizedEvent[]) {
    if (eventsToUse.length === 0) return

    const target = parseFloat(targetOdds) || 5
    const count = Math.min(numPicks, maxPicks, eventsToUse.length)
    const shuffled = [...eventsToUse].sort(() => Math.random() - 0.5)

    // Pick events with odds that roughly reach target when combined
    const selected: PickSelection[] = []
    for (const event of shuffled) {
      if (selected.length >= count) break
      const outcomes: ('home' | 'draw' | 'away')[] = ['home', 'away', 'draw']
      // For low risk: prefer favorites (lower odds), high risk: underdogs
      const sorted = outcomes
        .filter(o => event.best_odds[o] !== null)
        .sort((a, b) => {
          const oa = event.best_odds[a] ?? 99
          const ob = event.best_odds[b] ?? 99
          return riskLevel === 'alto' ? ob - oa : oa - ob
        })

      const outcome = sorted[0]
      if (!outcome || !event.best_odds[outcome]) continue

      const teamName = outcome === 'home' ? event.home_team : outcome === 'away' ? event.away_team : 'Empate'
      selected.push({
        event_id: event.id,
        event_name: event.event_name,
        sport_key: event.sport_key,
        sport_title: event.sport_title,
        league: event.league,
        commence_time: event.commence_time,
        market: '1X2',
        selection: `${outcome === 'home' ? '1' : outcome === 'away' ? '2' : 'X'} - ${teamName}`,
        odds: event.best_odds[outcome]!,
        bookmaker: '',
        implied_probability: event.implied_probability[outcome] ?? 0,
      })
    }

    setPicks(selected)
    setGenerated(true)
  }

  async function handleGenerate() {
    if (!isLoggedIn) return
    if (events.length === 0) {
      await loadEvents()
    } else {
      autoGenerate(events)
    }
  }

  // When events load after generate click
  const [pendingGenerate, setPendingGenerate] = useState(false)
  async function handleGenerateClick() {
    if (!isLoggedIn) return
    setGenerated(false)
    setPicks([])
    setAnalysis(null)
    setAnalysisError(null)
    if (events.length === 0) {
      setPendingGenerate(true)
      await loadEvents()
    } else {
      autoGenerate(events)
    }
  }

  // Trigger auto generate after events load
  if (pendingGenerate && events.length > 0 && !generated) {
    setPendingGenerate(false)
    autoGenerate(events)
  }

  async function handleAnalyze() {
    if (picks.length < 2) return
    setAnalyzing(true)
    setAnalysisError(null)
    setAnalysis(null)
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picks, risk_level: riskLevel, is_premium: isPremium }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido')
      setAnalysis(data)
    } catch (err: any) {
      setAnalysisError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const combined = picks.length > 0 ? totalOdds(picks.map(p => p.odds)) : 0

  function toggleSport(key: string) {
    if (!isPremium && selectedSports.length >= 2 && !selectedSports.includes(key)) return
    setSelectedSports(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key].slice(0, 5))
    setEvents([])
    setGenerated(false)
    setPicks([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Config panel */}
      <div className="lg:col-span-1 space-y-4">
        {/* Mode selector */}
        <div className="rounded-xl border border-superficie-hover bg-superficie/50 p-4">
          <p className="text-xs text-texto-secundario uppercase tracking-wider mb-3">Modo</p>
          <div className="grid grid-cols-2 gap-2">
            {(['auto', 'manual'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'bg-teal-600 text-white' : 'bg-superficie-hover text-texto-secundario hover:text-white'
                }`}
              >
                {m === 'auto' ? '⚡ Automático' : '🔧 Manual'}
              </button>
            ))}
          </div>
        </div>

        {/* Config */}
        <div className="rounded-xl border border-superficie-hover bg-superficie/50 p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-semibold text-white">Configuración</span>
          </div>

          {/* Riesgo */}
          <div>
            <p className="text-xs text-texto-secundario mb-2">Nivel de riesgo</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(['bajo', 'medio', 'alto'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRiskLevel(r)}
                  className={`py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                    riskLevel === r
                      ? r === 'bajo' ? 'bg-green-600 text-white'
                        : r === 'medio' ? 'bg-ambar text-white'
                        : 'bg-orange-600 text-white'
                      : 'bg-superficie-hover text-texto-secundario hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Cuota objetivo */}
          <div>
            <p className="text-xs text-texto-secundario mb-1.5">Cuota objetivo</p>
            <input
              type="number"
              value={targetOdds}
              onChange={e => setTargetOdds(e.target.value)}
              step="0.5" min="1.5" max="50"
              className="w-full rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Nº picks */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs text-texto-secundario">Nº de selecciones</p>
              {!isPremium && <span className="text-xs text-texto-terciario">máx. {maxPicks}</span>}
            </div>
            <input
              type="range"
              min="2" max={maxPicks}
              value={numPicks}
              onChange={e => setNumPicks(parseInt(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-xs text-texto-secundario mt-1">
              <span>2</span>
              <span className="text-teal-400 font-bold">{numPicks}</span>
              <span>{maxPicks}</span>
            </div>
            {!isPremium && maxPicks < 6 && (
              <Link href="/premium" className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 mt-1 transition-colors">
                <Lock className="h-3 w-3" /> Hasta 6 picks con Premium
              </Link>
            )}
          </div>

          {/* Deportes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-texto-secundario">Deportes / Ligas</p>
              {!isPremium && <span className="text-xs text-texto-terciario">máx. 2 (Free)</span>}
            </div>
            <div className="space-y-1.5">
              {FEATURED_SPORTS.map(s => {
                const disabled = !isPremium && selectedSports.length >= 2 && !selectedSports.includes(s.key)
                return (
                  <label key={s.key} className={`flex items-center gap-2 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={selectedSports.includes(s.key)}
                      onChange={() => toggleSport(s.key)}
                      disabled={disabled}
                      className="w-3.5 h-3.5 accent-teal-500"
                    />
                    <span className="text-xs text-texto-secundario">{s.emoji} {s.label}</span>
                  </label>
                )
              })}
            </div>
            {!isPremium && (
              <Link href="/premium" className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 mt-2 transition-colors">
                <Lock className="h-3 w-3" /> Deportes mixtos con Premium
              </Link>
            )}
          </div>
        </div>

        {/* Generate button */}
        {!isLoggedIn ? (
          <Link href="/login?redirect=/generador" className="block text-center bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-colors">
            Entrar para generar
          </Link>
        ) : (
          <button
            onClick={handleGenerateClick}
            disabled={loading || selectedSports.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            {loading ? 'Cargando eventos...' : 'Generar combinada'}
          </button>
        )}
      </div>

      {/* Results */}
      <div className="lg:col-span-2">
        {error && (
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 mb-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-400 shrink-0" />
            <p className="text-sm text-orange-300">{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: numPicks }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {generated && picks.length > 0 && !loading && (
          <>
            {/* Summary */}
            <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-teal-300 font-semibold mb-0.5">Combinada generada</p>
                  <p className="text-texto-secundario text-sm">{picks.length} selecciones · <RiskBadge level={riskLevel} className="inline-flex" /></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-texto-secundario">Cuota combinada</p>
                  <p className="text-2xl font-black text-white">{formatOdds(combined)}</p>
                </div>
              </div>
              <p className="text-xs text-orange-400/70 mt-2">
                Cuotas orientativas. Las predicciones pueden fallar. Esto no es un consejo de apuesta.
              </p>
              {isPremium ? (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || picks.length < 2}
                  className="mt-2 flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                  {analyzing ? 'Analizando...' : 'Analizar con IA'}
                </button>
              ) : (
                <Link href="/premium" className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 mt-2 transition-colors">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Analizar con IA — disponible con Premium <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {/* Picks */}
            <div className="space-y-3">
              {picks.map(pick => {
                const event = events.find(e => e.id === pick.event_id)
                if (!event) return null
                return (
                  <OddsCard
                    key={event.id}
                    event={event}
                    selectedPicks={picks}
                    onAddPick={p => setPicks(prev => [...prev.filter(x => x.event_id !== p.event_id), p])}
                    onRemovePick={id => setPicks(prev => prev.filter(p => p.event_id !== id))}
                  />
                )
              })}
            </div>

            <button
              onClick={handleGenerateClick}
              className="mt-4 w-full flex items-center justify-center gap-2 border border-superficie-hover hover:border-teal-500/40 text-texto-secundario hover:text-white text-sm py-2.5 rounded-xl transition-colors"
            >
              <Shuffle className="h-4 w-4" /> Regenerar
            </button>

            {analysisError && (
              <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-400 shrink-0" />
                <p className="text-sm text-orange-300">{analysisError}</p>
              </div>
            )}

            {analysis && <AnalysisResults analysis={analysis} />}
          </>
        )}

        {!generated && !loading && (
          <div className="rounded-xl border border-superficie-hover bg-superficie/30 p-12 text-center">
            <TrendingUp className="h-12 w-12 text-texto-terciario mx-auto mb-4" />
            <p className="text-texto-secundario font-medium mb-1">Configura y genera tu combinada</p>
            <p className="text-texto-terciario text-sm">Selecciona deportes, riesgo y número de picks, luego pulsa "Generar".</p>
          </div>
        )}
      </div>

      {/* Slip */}
      <ManualSelectionSlip
        picks={picks}
        onRemove={id => setPicks(prev => prev.filter(p => p.event_id !== id))}
        onClear={() => setPicks([])}
        isLoggedIn={isLoggedIn}
      />
    </div>
  )
}
