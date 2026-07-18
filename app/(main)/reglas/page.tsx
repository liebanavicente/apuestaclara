import Link from 'next/link'
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, ShieldCheck, Trophy } from 'lucide-react'

export const metadata = { title: 'Reglas — ApuestaClara' }

const WORLD_CUP_FINAL = new Date('2026-07-19T20:00:00Z')

const RULE_BLOCKS = [
  {
    icon: CheckCircle2,
    title: 'Cómo se juega',
    items: [
      'Entras al tablero, revisas partidos disponibles y eliges 1 / X / 2.',
      'Puedes anticiparte: las cuotas se mueven, así que el timing también cuenta.',
      'Cuando acaba el partido, el pick queda listo para resolver y actualizar el ranking.',
    ],
  },
  {
    icon: BarChart3,
    title: 'Puntuación',
    items: [
      'Acierto: sumas la cuota exacta en puntos. Una cuota 2.10 equivale a +2.10 pts.',
      'Fallo: 0 puntos. No hay saldo real, pérdidas ni staking.',
      'El ranking se ordena por puntos totales. En empate, manda el porcentaje de acierto.',
    ],
  },
  {
    icon: Trophy,
    title: 'Competición',
    items: [
      'La tabla mide lectura de mercado, constancia y acierto acumulado.',
      'El cierre competitivo se toma con la final del Mundial 2026.',
      'Los picks pendientes al cierre se revisan antes de congelar el ranking final.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Criterio limpio',
    items: [
      'ApuestaClara es una competición social sin dinero real.',
      'Puedes eliminar un pick pendiente antes de que empiece el partido si te equivocaste.',
      'El administrador puede invalidar picks inconsistentes o resueltos fuera de criterio.',
    ],
  },
]

export default function ReglasPage() {
  const now = new Date()
  const diff = WORLD_CUP_FINAL.getTime() - now.getTime()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-neon">Reglamento</p>
          <h1 className="font-display text-5xl text-white sm:text-6xl">Reglas claras para competir mejor</h1>
          <p className="mt-4 max-w-2xl text-texto-secundario">
            El sistema premia aciertos por cuota, no volumen vacío. Sin dinero real, sin saldo que perder:
            solo picks, puntos y ranking.
          </p>
        </div>

        <div className="rounded-lg border border-neon/10 bg-superficie/80 p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-neon">
            <CalendarDays className="h-4 w-4" />
            Cierre de mercado
          </div>
          <p className="font-mono text-5xl font-black text-ambar">{days}</p>
          <p className="mt-1 text-sm text-texto-secundario">días restantes</p>
          <p className="mt-3 text-xs text-texto-terciario">19 jul 2026 · Final del Mundial</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {RULE_BLOCKS.map(({ icon: Icon, title, items }) => (
          <section key={title} className="rounded-lg border border-neon/10 bg-superficie/70 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-neon/10 text-neon">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-texto-secundario">
              {items.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-ambar/20 bg-ambar/5 p-5">
        <p className="mb-2 text-sm font-bold text-white">Ejemplo rápido</p>
        <p className="text-sm text-texto-secundario">
          Aciertas <strong className="text-white">Local gana</strong> con cuota <strong className="text-white">1.85</strong> y sumas{' '}
          <span className="font-bold text-neon">+1.85 pts</span>. Fallas <strong className="text-white">Empate</strong> con cuota{' '}
          <strong className="text-white">3.40</strong> y el pick queda en <span className="text-texto-secundario">0 pts</span>.
        </p>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/dashboard" className="shine-btn inline-flex items-center justify-center gap-2 rounded-md bg-neon px-6 py-3 font-black text-carbon transition-all hover:brightness-110">
          Hacer picks
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/ranking" className="inline-flex items-center justify-center gap-2 rounded-md border border-neon/10 px-6 py-3 font-semibold text-white transition-colors hover:border-neon/50 hover:text-neon">
          Ver ranking
        </Link>
      </div>
    </main>
  )
}
