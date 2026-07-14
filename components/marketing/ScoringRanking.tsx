'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

const WORLD_CUP_FINAL = new Date('2026-07-19T20:00:00Z').getTime()

const SCORE_CARDS = [
  {
    emoji: '✅',
    label: 'Aciertas',
    value: '+3.50 pts',
    desc: 'Cuota 3.50 = +3.50 pts',
    border: '#C60B1E',
  },
  {
    emoji: '❌',
    label: 'Fallas',
    value: '0 pts',
    desc: 'No pierdes nada. Solo te quedas sin puntos',
    border: '#FF6B6B',
  },
  {
    emoji: '🍺',
    label: 'El último paga',
    value: '19 jul 2026',
    desc: 'El ranking decide quién paga las birras',
    border: '#FFC400',
  },
]

const RANKING = [
  { rank: 1, medal: '🥇', avatar: '😎', name: 'ElBicho', points: 45.2, picks: ['✅', '✅', '✅', '❌', '✅'] },
  { rank: 2, medal: '🥈', avatar: '🤠', name: 'DonCagao', points: 38.75, picks: ['✅', '❌', '✅', '✅', '✅'] },
  { rank: 3, medal: '🥉', avatar: '🦁', name: 'LaFiera', points: 32.1, picks: ['✅', '✅', '❌', '✅', '❌'] },
  { rank: 4, medal: null, avatar: '🦊', name: 'Zorro', points: 28.5, picks: ['❌', '✅', '✅', '❌', '✅'] },
  { rank: 5, medal: null, avatar: '🐸', name: 'ElRana', points: 22.3, picks: ['❌', '❌', '✅', '✅', '❌'] },
]

const YOU = { rank: 12, avatar: '😰', name: 'TÚ (si te registras)', points: 5.2, picks: ['❌', '❌', '❌', '❌', '❌'] }
const LAST = { rank: 15, avatar: '🍺', name: 'ElÚltimo', points: 0, picks: ['❌', '❌', '❌', '❌', '❌'] }

function useCountdown() {
  const [remaining, setRemaining] = useState<number>(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, WORLD_CUP_FINAL - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const days = Math.floor(remaining / 86400000)
  const hours = Math.floor((remaining % 86400000) / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function PickDots({ picks }: { picks: string[] }) {
  return (
    <div className="flex gap-1">
      {picks.map((p, i) => (
        <span key={i} className="text-xs">
          {p}
        </span>
      ))}
    </div>
  )
}

export function ScoringRanking() {
  const { days, hours, minutes, seconds } = useCountdown()

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-display text-4xl tracking-wide text-[#FFFFFF] sm:text-6xl">
            📊 La puntuación es simple
          </h2>
          <Link href="/reglas" className="text-sm text-texto-secundario transition-colors hover:text-neon">
            Ver reglas →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SCORE_CARDS.map((c, i) => (
            <Reveal key={c.label} delay={i * 100}>
              <div
                className="rounded-2xl bg-[#10203F] p-8 text-center"
                style={{ borderTop: `3px solid ${c.border}` }}
              >
                <div className="mb-2 text-3xl">{c.emoji}</div>
                <p className="text-[14px] uppercase tracking-[2px] text-texto-secundario">{c.label}</p>
                <p className="mt-2 font-display text-6xl tracking-wide text-[#FFFFFF]">{c.value}</p>
                <p className="mt-3 text-sm text-texto-secundario">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-14">
          <h3 className="mb-5 font-display text-3xl tracking-wide text-[#FFFFFF]">
            🏆 Ranking en tiempo real
          </h3>

          <div className="overflow-hidden rounded-2xl bg-[#10203F]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="text-[14px] uppercase text-texto-secundario">
                    <th className="px-6 py-4 font-normal">#</th>
                    <th className="px-2 py-4 font-normal">Nombre</th>
                    <th className="px-2 py-4 font-normal">Puntos</th>
                    <th className="px-6 py-4 font-normal">Últimos picks</th>
                  </tr>
                </thead>
                <tbody>
                  {RANKING.map(p => (
                    <tr key={p.name} className="border-t border-[#1B2E54]">
                      <td className="px-6 py-4 text-sm">{p.medal ?? p.rank}</td>
                      <td className="px-2 py-4 text-sm font-medium text-[#FFFFFF]">
                        {p.avatar} {p.name}
                      </td>
                      <td className="px-2 py-4 font-mono text-sm text-[#FFFFFF]">{p.points.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <PickDots picks={p.picks} />
                      </td>
                    </tr>
                  ))}

                  <tr className="border-t-2 border-neon bg-neon/5">
                    <td className="px-6 py-4 text-sm">{YOU.rank}</td>
                    <td className="px-2 py-4 text-sm font-medium text-[#FFFFFF]">
                      {YOU.avatar} {YOU.name}
                    </td>
                    <td className="px-2 py-4 font-mono text-sm text-[#FFFFFF]">{YOU.points.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <PickDots picks={YOU.picks} />
                    </td>
                  </tr>

                  <tr className="border-t border-[#1B2E54]" style={{ background: 'rgba(255,107,107,0.1)' }}>
                    <td className="px-6 py-4 text-sm text-[#FF6B6B]">🔴 {LAST.rank}</td>
                    <td className="px-2 py-4 text-sm font-medium text-[#FFFFFF]">
                      {LAST.avatar} {LAST.name}
                      <p className="mt-0.5 text-xs font-normal text-texto-secundario">
                        &ldquo;¡La ronda va por mi cuenta!&rdquo;
                      </p>
                    </td>
                    <td className="px-2 py-4 font-mono text-sm text-[#FFFFFF]">{LAST.points.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <PickDots picks={LAST.picks} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-texto-secundario">
            Faltan{' '}
            <span
              className={cn(
                'font-mono text-3xl font-bold text-ambar sm:text-4xl',
                seconds % 2 === 0 ? 'opacity-100' : 'opacity-80'
              )}
            >
              {days}d {hours}h {minutes}m {seconds}s
            </span>{' '}
            para que alguien pague...
          </p>
        </Reveal>
      </div>
    </section>
  )
}
