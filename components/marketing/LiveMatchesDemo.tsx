'use client'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

type Outcome = { label: string; team: string; odds: number }
type DemoMatch = {
  id: string
  tournament: string
  home: Outcome
  draw?: Outcome
  away: Outcome
  time: string
  status: 'abierto' | 'en_vivo'
}

const MATCHES: DemoMatch[] = [
  {
    id: 'rm-fcb',
    tournament: 'Champions League',
    home: { label: '1', team: 'Real Madrid', odds: 1.85 },
    draw: { label: 'X', team: 'Empate', odds: 3.4 },
    away: { label: '2', team: 'Barcelona', odds: 4.2 },
    time: '⏰ Hoy 21:00',
    status: 'abierto',
  },
  {
    id: 'esp-arg',
    tournament: 'Mundial 2026',
    home: { label: '1', team: 'España', odds: 2.1 },
    draw: { label: 'X', team: 'Empate', odds: 3.25 },
    away: { label: '2', team: 'Argentina', odds: 3.8 },
    time: '⏰ 15 jul 20:00',
    status: 'abierto',
  },
  {
    id: 'mc-ars',
    tournament: 'Champions League',
    home: { label: '1', team: 'Man City', odds: 1.6 },
    draw: { label: 'X', team: 'Empate', odds: 4.0 },
    away: { label: '2', team: 'Arsenal', odds: 5.5 },
    time: '⏰ Mañana 18:30',
    status: 'abierto',
  },
]

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
          ? 'border-neon bg-neon font-bold text-[#0B3D2E]'
          : 'border-[#2A2A2A] bg-[#2A2A2A] text-[#F5F5F5] hover:border-neon hover:bg-neon/20 hover:text-neon'
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

function MatchCard({ match, delay }: { match: DemoMatch; delay: number }) {
  const [selection, setSelection] = useState<string | null>(null)
  const outcomes = [match.home, match.draw, match.away].filter(Boolean) as Outcome[]

  return (
    <Reveal delay={delay}>
      <div className="group rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-6 transition-all hover:-translate-y-1 hover:border-neon hover:shadow-[0_8px_30px_rgba(0,230,118,0.15)]">
        <span className="inline-block rounded-full bg-neon/15 px-3 py-1 text-[11px] font-medium text-neon">
          {match.tournament}
        </span>

        <div className="mt-4 flex items-center justify-between text-center">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#F5F5F5]">{match.home.team}</p>
          </div>
          <span className="px-2 text-[13px] tracking-[4px] text-texto-secundario">VS</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#F5F5F5]">{match.away.team}</p>
          </div>
        </div>

        <div className={cn('mt-4 grid gap-2', match.draw ? 'grid-cols-3' : 'grid-cols-2')}>
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
          <span>{match.time}</span>
          <span className="text-neon">🟢 Abierto</span>
        </div>
      </div>
    </Reveal>
  )
}

export function LiveMatchesDemo() {
  return (
    <section id="partidos" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-display text-3xl tracking-wide text-[#F5F5F5] sm:text-4xl">
            🔥 Próximos Partidos
          </h2>
          <Link href="/dashboard" className="text-sm text-texto-secundario transition-colors hover:text-neon">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MATCHES.map((m, i) => (
            <MatchCard key={m.id} match={m} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
