'use client'
import { useState } from 'react'
import Link from 'next/link'
import { cn, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/shared/EmptyState'
import { Reveal } from './Reveal'
import type { NormalizedEvent } from '@/types/odds'

type Outcome = { label: string; team: string; odds: number }

function RippleButton({
  outcome,
  selected,
  onClick,
}: {
  outcome: Outcome
  selected: boolean
  onClick: () => void
}) {
  const [ripples, setRipples] = useState<number[]>([])

  function handleClick() {
    const id = Date.now()
    setRipples(r => [...r, id])
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 400)
    onClick()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      aria-label={`Elegir ${outcome.team}, cuota ${outcome.odds.toFixed(2)}`}
      title={`+${outcome.odds.toFixed(2)} pts si aciertas`}
      className={cn(
        'group relative flex flex-col items-center overflow-hidden rounded-lg border px-2 py-2.5 text-center transition-all',
        selected
          ? 'border-neon bg-neon font-bold text-white'
          : 'border-[#1B2E54] bg-[#1B2E54] text-[#FFFFFF] hover:border-neon hover:bg-neon/20 hover:text-neon'
      )}
    >
      {ripples.map(id => (
        <span
          key={id}
          className="animate-ripple pointer-events-none absolute h-16 w-16 rounded-full bg-neon/40"
        />
      ))}
      <span className="relative text-[10px] opacity-70">{outcome.label}</span>
      <span className="relative font-mono text-base">{outcome.odds.toFixed(2)}</span>
      <span className="relative hidden text-[10px] opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        +{outcome.odds.toFixed(2)} pts
      </span>
    </button>
  )
}

function MatchCard({ event, delay }: { event: NormalizedEvent; delay: number }) {
  const [selection, setSelection] = useState<string | null>(null)

  const outcomes: Outcome[] = [
    event.best_odds.home != null ? { label: '1', team: event.home_team, odds: event.best_odds.home } : null,
    event.best_odds.draw != null ? { label: 'X', team: 'Empate', odds: event.best_odds.draw } : null,
    event.best_odds.away != null ? { label: '2', team: event.away_team, odds: event.best_odds.away } : null,
  ].filter((o): o is Outcome => o !== null)

  const started = new Date(event.commence_time) < new Date()

  return (
    <Reveal delay={delay}>
      <div className="group rounded-2xl border border-[#1B2E54] bg-[#10203F] p-6 transition-all hover:-translate-y-1 hover:border-neon hover:shadow-[0_8px_30px_rgba(198,11,30,0.15)]">
        <span className="inline-block rounded-full bg-neon/15 px-3 py-1 text-[11px] font-medium text-neon">
          {event.league}
        </span>

        <div className="mt-4 flex items-center justify-between text-center">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#FFFFFF]">{event.home_team}</p>
          </div>
          <span className="px-2 text-[13px] tracking-[4px] text-texto-secundario">VS</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#FFFFFF]">{event.away_team}</p>
          </div>
        </div>

        <div className={cn('mt-4 grid gap-2', outcomes.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
          {outcomes.map(o => (
            <RippleButton
              key={o.label}
              outcome={o}
              selected={selection === o.label}
              onClick={() => setSelection(prev => (prev === o.label ? null : o.label))}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-[13px] text-texto-secundario">
          <span>⏰ {formatDate(event.commence_time)}</span>
          <span className={started ? 'text-error' : 'text-neon'}>{started ? '🔴 En vivo' : '🟢 Abierto'}</span>
        </div>
      </div>
    </Reveal>
  )
}

export function LiveMatchesDemo({ matches }: { matches: NormalizedEvent[] }) {
  return (
    <section id="partidos" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-display text-4xl tracking-wide text-[#FFFFFF] sm:text-6xl">
            🔥 Próximos Partidos
          </h2>
          <Link href="/dashboard" className="text-sm text-texto-secundario transition-colors hover:text-neon">
            Ver todos →
          </Link>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            icon={<span className="text-5xl">🐟💤</span>}
            title="No hay partidos ahora"
            description="Los Gañanes están descansando... vuelve más tarde o mira el calendario completo."
            action={
              <Link href="/dashboard" className="text-neon hover:underline text-sm">
                Ver calendario →
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.slice(0, 3).map((event, i) => (
              <MatchCard key={event.id} event={event} delay={i * 100} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
