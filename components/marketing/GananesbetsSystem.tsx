import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  ListChecks,
  Trophy,
} from 'lucide-react'
import { Reveal } from './Reveal'

const ROUTES = [
  { href: '/dashboard', label: 'Partidos', icon: CalendarDays, stat: '1X2', desc: 'Elige local, empate o visitante antes del inicio.' },
  { href: '/mundial', label: 'Mundial', icon: Trophy, stat: '2026', desc: 'Grupos, calendario y picks de la competición.' },
  { href: '/mis-picks', label: 'Mis picks', icon: ListChecks, stat: '+ cuota', desc: 'Tu slip confirma selecciones y puntos potenciales.' },
  { href: '/ranking', label: 'Ranking', icon: Gauge, stat: 'LIVE', desc: 'La tabla ordena aciertos, pendientes y puntos totales.' },
]

const SLIP = [
  { match: 'España - Japón', pick: '1', odds: '1.82', status: 'Pendiente' },
  { match: 'Argentina - Canadá', pick: 'X', odds: '3.40', status: 'Pendiente' },
  { match: 'Brasil - Marruecos', pick: '2', odds: '2.65', status: 'Ganado' },
]

export function GananesbetsSystem() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/10 blur-[160px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="mb-3 font-mono text-xs font-semibold uppercase text-neon">Gananesbets logic</p>
            <h2 className="font-display text-5xl leading-[0.94] text-white sm:text-7xl">
              No es una portada. Es el juego entero, visible.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-texto-secundario lg:justify-self-end">
            La base visual ahora cuenta la mecánica real: entras, eliges partidos, haces picks ficticios,
            cada cuota se transforma en puntos y el ranking decide quién lee mejor el mercado.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="cryptix-panel relative min-h-full overflow-hidden rounded-lg p-5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase text-neon">Pick slip</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">Tu boleto sin dinero real</h3>
                </div>
                <span className="rounded-full border border-ambar/25 bg-ambar/10 px-3 py-1 font-mono text-xs font-bold text-ambar">
                  +7.87 pts
                </span>
              </div>

              <div className="space-y-3">
                {SLIP.map(row => (
                  <div key={row.match} className="rounded-md border border-white/10 bg-carbon/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{row.match}</p>
                        <p className="mt-1 text-xs text-texto-terciario">Selección {row.pick} · cuota {row.odds}</p>
                      </div>
                      <span className="font-mono text-xl font-black text-neon">{row.odds}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                      <span className="text-texto-secundario">{row.status}</span>
                      <span className="font-mono text-ambar">+{row.odds} pts si acierta</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/mis-picks"
                className="shine-btn mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-neon px-5 py-4 text-sm font-black text-carbon transition-transform hover:scale-[1.01]"
              >
                Ver mis picks
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {ROUTES.map(({ href, label, icon: Icon, stat, desc }, index) => (
                <Link
                  key={href}
                  href={href}
                  className="cryptix-panel group relative overflow-hidden rounded-lg p-5 transition-all hover:-translate-y-1 hover:border-neon/40"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-neon/10 blur-2xl transition-opacity group-hover:opacity-80" />
                  <div className="relative flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-md border border-neon/20 bg-neon/10 text-neon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-sm font-black text-ambar">{stat}</span>
                  </div>
                  <h3 className="relative mt-5 text-2xl font-bold text-white">{label}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-texto-secundario">{desc}</p>
                  <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neon">
                    Abrir
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  {index === 0 && (
                    <div className="relative mt-5 grid grid-cols-3 gap-2">
                      {['1', 'X', '2'].map(value => (
                        <span key={value} className="rounded-md border border-neon/10 bg-carbon/70 py-2 text-center font-mono text-sm font-bold text-white">
                          {value}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={220} className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="cryptix-panel rounded-lg p-5">
              <CircleDollarSign className="mb-4 h-6 w-6 text-neon" />
              <p className="text-xl font-bold text-white">Sin staking</p>
              <p className="mt-2 text-sm text-texto-secundario">No se mueve dinero real. El riesgo está en tu lectura, no en tu cartera.</p>
            </div>
            <div className="cryptix-panel rounded-lg p-5">
              <CheckCircle2 className="mb-4 h-6 w-6 text-neon" />
              <p className="text-xl font-bold text-white">Resolución clara</p>
              <p className="mt-2 text-sm text-texto-secundario">Los picks pasan de pendiente a ganado o fallado y actualizan puntos.</p>
            </div>
            <div className="cryptix-panel rounded-lg p-5">
              <Trophy className="mb-4 h-6 w-6 text-neon" />
              <p className="text-xl font-bold text-white">Último paga ronda</p>
              <p className="mt-2 text-sm text-texto-secundario">La competición mantiene la broma original de Gananesbets: orgullo, pique y tabla pública.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
