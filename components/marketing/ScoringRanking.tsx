'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

const WORLD_CUP_FINAL = new Date('2026-07-19T20:00:00Z').getTime()

const SCORE_CARDS = [
  {
    emoji: '+',
    label: 'Aciertas',
    value: '+3.50 pts',
    desc: 'Cuota 3.50 = +3.50 pts',
    border: '#B7FF38',
  },
  {
    emoji: '0',
    label: 'Fallas',
    value: '0 pts',
    desc: 'No pierdes nada. Solo te quedas sin puntos',
    border: '#FF6B6B',
  },
  {
    emoji: '#',
    label: 'Cierre',
    value: '19 jul 2026',
    desc: 'El ranking queda congelado al cierre de mercado',
    border: '#5EF2C2',
  },
]

const RANKING = [
  { rank: 1, medal: '01', avatar: 'EB', name: 'ElBicho', points: 45.2, picks: ['W', 'W', 'W', 'L', 'W'] },
  { rank: 2, medal: '02', avatar: 'DC', name: 'DonCagao', points: 38.75, picks: ['W', 'L', 'W', 'W', 'W'] },
  { rank: 3, medal: '03', avatar: 'LF', name: 'LaFiera', points: 32.1, picks: ['W', 'W', 'L', 'W', 'L'] },
  { rank: 4, medal: null, avatar: 'ZO', name: 'Zorro', points: 28.5, picks: ['L', 'W', 'W', 'L', 'W'] },
  { rank: 5, medal: null, avatar: 'ER', name: 'ElRana', points: 22.3, picks: ['L', 'L', 'W', 'W', 'L'] },
]

const YOU = { rank: 12, avatar: 'TU', name: 'TÚ (si te registras)', points: 5.2, picks: ['L', 'L', 'L', 'L', 'L'] }
const LAST = { rank: 15, avatar: 'EU', name: 'ElÚltimo', points: 0, picks: ['L', 'L', 'L', 'L', 'L'] }

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
        <span
          key={i}
          className={cn(
            'grid h-5 w-5 place-items-center rounded-sm font-mono text-[10px] font-bold',
            p === 'W' ? 'bg-neon/10 text-neon' : 'bg-error/10 text-error'
          )}
        >
          {p}
        </span>
      ))}
    </div>
  )
}

export function ScoringRanking() {
  const { days, hours, minutes, seconds } = useCountdown()

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs font-semibold uppercase text-neon">Tabla Gananesbets</p>
            <h2 className="font-display text-4xl leading-[0.98] text-[#FFFFFF] sm:text-6xl">
              La cuota es la puntuación
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-texto-secundario">
              No hay saldo ni staking: solo picks ficticios. La tabla premia a quien
              acierta cuotas más altas sin hundirse a base de fallos.
            </p>
          </div>
          <Link href="/reglas" className="inline-flex rounded-full border border-neon/20 px-4 py-2 text-sm text-texto-secundario transition-colors hover:bg-neon/10 hover:text-neon">
            Ver reglas
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SCORE_CARDS.map((c, i) => (
            <Reveal key={c.label} delay={i * 100}>
              <div
                className="cryptix-panel rounded-lg p-8 text-center"
                style={{ borderTop: `3px solid ${c.border}` }}
              >
                <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-md bg-neon/10 font-mono text-lg font-black text-neon">{c.emoji}</div>
                <p className="text-[14px] uppercase tracking-[2px] text-texto-secundario">{c.label}</p>
                <p className="mt-2 font-display text-5xl text-[#FFFFFF] sm:text-6xl">{c.value}</p>
                <p className="mt-3 text-sm text-texto-secundario">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-14">
          <h3 className="mb-5 font-display text-3xl tracking-wide text-[#FFFFFF]">
            Ranking en tiempo real
          </h3>

          <div className="cryptix-panel overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="bg-white/[0.03] font-mono text-[12px] uppercase text-texto-secundario">
                    <th className="px-6 py-4 font-normal">#</th>
                    <th className="px-2 py-4 font-normal">Nombre</th>
                    <th className="px-2 py-4 font-normal">Puntos</th>
                    <th className="px-6 py-4 font-normal">Últimos picks</th>
                  </tr>
                </thead>
                <tbody>
                  {RANKING.map(p => (
                    <tr key={p.name} className="border-t border-neon/10 transition-colors hover:bg-neon/[0.035]">
                      <td className="px-6 py-4 text-sm">{p.medal ?? p.rank}</td>
                      <td className="px-2 py-4 text-sm font-medium text-[#FFFFFF]">
                        <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-md bg-white/5 font-mono text-[10px] text-neon">{p.avatar}</span>
                        {p.name}
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
                      <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-md bg-white/5 font-mono text-[10px] text-neon">{YOU.avatar}</span>
                      {YOU.name}
                    </td>
                    <td className="px-2 py-4 font-mono text-sm text-[#FFFFFF]">{YOU.points.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <PickDots picks={YOU.picks} />
                    </td>
                  </tr>

                  <tr className="border-t border-error/20" style={{ background: 'rgba(255,99,122,0.08)' }}>
                    <td className="px-6 py-4 text-sm text-error">{LAST.rank}</td>
                    <td className="px-2 py-4 text-sm font-medium text-[#FFFFFF]">
                      <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-md bg-error/10 font-mono text-[10px] text-error">{LAST.avatar}</span>
                      {LAST.name}
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
            para el cierre de mercado
          </p>
        </Reveal>
      </div>
    </section>
  )
}
