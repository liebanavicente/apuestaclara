'use client'
import { Plus, Check, Clock } from 'lucide-react'
import { formatDate, timeUntil, formatOdds, cn } from '@/lib/utils'
import { RealDataBadge } from '@/components/shared/RealDataBadge'
import type { NormalizedEvent, PickSelection } from '@/types/odds'

interface OddsCardProps {
  event: NormalizedEvent
  selectedPicks: PickSelection[]
  onAddPick: (pick: PickSelection) => void
  onRemovePick: (eventId: string) => void
}

const OUTCOME_LABELS: Record<string, string> = {
  home: '1',
  draw: 'X',
  away: '2',
}

export function OddsCard({ event, selectedPicks, onAddPick, onRemovePick }: OddsCardProps) {
  const isSelected = selectedPicks.some(p => p.event_id === event.id)
  const started = new Date(event.commence_time) < new Date()

  function getBestBookmaker(outcome: 'home' | 'draw' | 'away'): string {
    const teamName = outcome === 'home' ? event.home_team : outcome === 'away' ? event.away_team : 'Draw'
    let best = 0
    let bookmaker = ''
    for (const bm of event.bookmakers) {
      const market = bm.markets.find(m => m.key === 'h2h')
      const o = market?.outcomes.find(o => o.name === teamName)
      if (o && o.price > best) { best = o.price; bookmaker = bm.title }
    }
    return bookmaker
  }

  function handlePick(outcome: 'home' | 'draw' | 'away') {
    const odds = event.best_odds[outcome]
    if (!odds) return
    const existing = selectedPicks.find(p => p.event_id === event.id)
    if (existing) {
      onRemovePick(event.id)
      return
    }
    const teamName = outcome === 'home' ? event.home_team : outcome === 'away' ? event.away_team : 'Empate'
    onAddPick({
      event_id: event.id,
      event_name: event.event_name,
      sport_key: event.sport_key,
      sport_title: event.sport_title,
      league: event.league,
      commence_time: event.commence_time,
      market: '1X2',
      selection: `${OUTCOME_LABELS[outcome]} - ${teamName}`,
      odds,
      bookmaker: getBestBookmaker(outcome),
      implied_probability: event.implied_probability[outcome] ?? 0,
    })
  }

  return (
    <div className={cn(
      'rounded-xl border bg-slate-900/50 p-4 transition-colors',
      isSelected ? 'border-teal-500/50 bg-teal-950/20' : 'border-slate-800 hover:border-slate-700'
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-teal-400 font-medium">{event.league}</span>
            <RealDataBadge />
            {started && <span className="text-xs text-orange-400 font-medium">En curso</span>}
          </div>
          <p className="text-slate-200 font-medium text-sm leading-snug">{event.event_name}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{formatDate(event.commence_time)}</span>
            {!started && <span className="text-teal-500">({timeUntil(event.commence_time)})</span>}
          </div>
        </div>
        <span className="text-xs text-slate-600 shrink-0">{event.bookmakers_count} casas</span>
      </div>

      {/* Odds buttons */}
      <div className={cn('grid gap-2', event.best_odds.draw ? 'grid-cols-3' : 'grid-cols-2')}>
        {(['home', 'draw', 'away'] as const)
          .filter(o => event.best_odds[o] !== null)
          .map(outcome => {
            const odds = event.best_odds[outcome]!
            const prob = event.implied_probability[outcome]
            const teamName = outcome === 'home' ? event.home_team : outcome === 'away' ? event.away_team : 'Empate'
            const isPickSelected = selectedPicks.some(p => p.event_id === event.id && p.selection.startsWith(OUTCOME_LABELS[outcome]))

            return (
              <button
                key={outcome}
                onClick={() => handlePick(outcome)}
                disabled={started}
                className={cn(
                  'flex flex-col items-center rounded-lg border px-2 py-2.5 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed',
                  isPickSelected
                    ? 'border-teal-500 bg-teal-500/20 text-teal-300'
                    : 'border-slate-700 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-300'
                )}
              >
                <span className="text-xs text-slate-500 mb-0.5">{OUTCOME_LABELS[outcome]}</span>
                <span className="font-bold text-white text-base">{formatOdds(odds)}</span>
                <span className="text-xs text-slate-500 truncate w-full">{prob}%</span>
                <span className="text-xs text-slate-600 truncate w-full mt-0.5" title={teamName}>
                  {teamName.length > 12 ? teamName.slice(0, 12) + '…' : teamName}
                </span>
                {isPickSelected && <Check className="h-3 w-3 text-teal-400 mt-1" />}
              </button>
            )
          })}
      </div>

      {!isSelected && !started && (
        <button
          onClick={() => handlePick(event.best_odds.home !== null ? 'home' : 'away')}
          className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-teal-400 transition-colors py-1"
        >
          <Plus className="h-3 w-3" /> Añadir a selección
        </button>
      )}
    </div>
  )
}
