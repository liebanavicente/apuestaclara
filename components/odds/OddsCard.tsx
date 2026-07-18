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
      'rounded-lg border bg-superficie/70 p-4 transition-colors',
      isSelected ? 'border-neon/50 bg-neon/10' : 'border-neon/10 hover:border-neon/30'
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-medium uppercase text-neon">{event.league}</span>
            <RealDataBadge />
            {started && <span className="text-xs font-medium text-ambar">En curso</span>}
          </div>
          <p className="text-sm font-medium leading-snug text-white">{event.event_name}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-texto-terciario">
            <Clock className="h-3 w-3" />
            <span>{formatDate(event.commence_time)}</span>
            {!started && <span className="text-neon">({timeUntil(event.commence_time)})</span>}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-xs text-texto-terciario">{event.bookmakers_count} casas</span>
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
                  'flex flex-col items-center rounded-md border px-2 py-2.5 text-center transition-all disabled:cursor-not-allowed disabled:opacity-40',
                  isPickSelected
                    ? 'border-neon bg-neon/15 text-neon'
                    : 'border-neon/10 text-texto-secundario hover:border-neon/50 hover:bg-neon/5'
                )}
              >
                <span className="mb-0.5 text-xs text-texto-terciario">{OUTCOME_LABELS[outcome]}</span>
                <span className="font-mono text-base font-bold text-white">{formatOdds(odds)}</span>
                <span className="w-full truncate text-xs text-texto-terciario">{prob}%</span>
                <span className="mt-0.5 w-full truncate text-xs text-texto-terciario" title={teamName}>
                  {teamName.length > 12 ? teamName.slice(0, 12) + '…' : teamName}
                </span>
                {isPickSelected && <Check className="mt-1 h-3 w-3 text-neon" />}
              </button>
            )
          })}
      </div>

      {!isSelected && !started && (
        <button
          onClick={() => handlePick(event.best_odds.home !== null ? 'home' : 'away')}
          className="mt-2 flex w-full items-center justify-center gap-1 py-1 text-xs text-texto-terciario transition-colors hover:text-neon"
        >
          <Plus className="h-3 w-3" /> Añadir a selección
        </button>
      )}
    </div>
  )
}
