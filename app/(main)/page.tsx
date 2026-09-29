import Link from 'next/link'
import { Calendar, Trophy, Beer, ArrowRight, Check, Minus } from 'lucide-react'

const FEATURES = [
  {
    icon: Calendar,
    title: 'LaLiga y Champions',
    desc: 'Cuotas reales de cada jornada. Eliges local, empate o visitante y listo.',
  },
  {
    icon: Trophy,
    title: 'Aciertas, sumas la cuota',
    desc: 'Un acierto a 2.50 son +2.50 puntos. Fallar no resta nunca.',
  },
  {
    icon: Beer,
    title: 'La ronda está en juego',
    desc: 'El último de la tabla paga las birras. El primero elige el bar.',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 pt-16 sm:pt-24 pb-10 text-center overflow-x-clip">
        <div className="max-w-3xl mx-auto anim-slide-up">
          <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full gb-card text-[13px] font-medium text-ink-2 mb-7">
            🐟 Club de pronósticos entre amigos
          </span>

          <h1 className="text-[2.6rem] leading-[1.04] sm:text-7xl font-bold tracking-[-0.045em] text-ink">
            Quien pierda
            <br />
            <span className="bg-gradient-to-b from-amber-400 to-orange-600 bg-clip-text text-transparent">
              paga las birras.
            </span>
          </h1>

          <p className="text-ink-2 text-lg sm:text-xl mt-6 max-w-xl mx-auto leading-relaxed tracking-[-0.01em]">
            Pronostica LaLiga y la Champions con cuotas reales. Sin dinero, solo orgullo y una ronda.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="gb-btn gb-btn-primary gb-btn-lg w-full sm:w-auto">
              Ver partidos <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/ranking" className="gb-btn gb-btn-secondary gb-btn-lg w-full sm:w-auto">
              <Trophy className="w-4 h-4 text-amber-500" /> Clasificación
            </Link>
          </div>
        </div>

        {/* Product preview — a floating glass match card */}
        <div className="relative max-w-md mx-auto mt-16 anim-scale-in" style={{ animationDelay: '150ms' }} aria-hidden="true">
          <div className="absolute -inset-10 bg-gradient-to-tr from-amber-300/40 via-orange-200/30 to-indigo-200/40 blur-3xl rounded-full" />
          <div className="relative gb-card rounded-[28px] p-5 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="gb-chip">LaLiga</span>
              <span className="text-xs text-ink-3">Sáb 21:00</span>
            </div>
            <p className="text-lg font-semibold tracking-[-0.02em] text-ink mb-4">Real Madrid vs Atlético</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'RMA', v: '1.85', on: true },
                { k: 'X', v: '3.60', on: false },
                { k: 'ATM', v: '4.20', on: false },
              ].map(o => (
                <div
                  key={o.k}
                  className={`rounded-2xl py-3 text-center ${o.on ? 'gb-btn-odds-selected' : 'gb-btn-odds'}`}
                >
                  <div className="text-[11px] font-medium opacity-60">{o.k}</div>
                  <div className="gb-odds-value text-lg font-semibold tabular-nums mt-0.5">{o.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-500/10 px-3.5 py-2.5">
              <span className="text-sm text-emerald-800 font-medium">Si aciertas</span>
              <span className="text-sm font-semibold text-emerald-700 tabular-nums">+1.85 pts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="gb-card rounded-3xl p-6 anim-slide-up">
              <span className="w-10 h-10 rounded-2xl bg-amber-500/12 text-amber-600 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="font-semibold text-ink text-[17px] tracking-[-0.02em] mb-1.5">{title}</h3>
              <p className="text-ink-2 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring */}
      <section className="px-4 py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="gb-eyebrow mb-2">Puntuación</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-ink">Simple. Sin letra pequeña.</h2>
        </div>
        <div className="gb-card rounded-3xl divide-y divide-black/[0.06] overflow-hidden">
          <Row
            icon={<Check className="w-4 h-4" />}
            tone="bg-emerald-500/12 text-emerald-600"
            title="Aciertas"
            desc="Sumas la cuota entera. Cuota 3.20 → +3.20 pts."
          />
          <Row
            icon={<Minus className="w-4 h-4" />}
            tone="bg-black/[0.05] text-ink-3"
            title="Fallas"
            desc="0 puntos ese partido. Nunca se resta."
          />
          <Row
            icon={<Beer className="w-4 h-4" />}
            tone="bg-amber-500/12 text-amber-600"
            title="Fin de temporada"
            desc="El último del ranking invita a la ronda."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-ink max-w-lg mx-auto">
          ¿Quién sabe de fútbol aquí?
        </h2>
        <p className="text-ink-2 mt-3">Entras en 10 segundos. Sin contraseña.</p>
        <Link href="/dashboard" className="gb-btn gb-btn-accent gb-btn-lg mt-8">
          Entrar al club 🐟
        </Link>
      </section>
    </div>
  )
}

function Row({ icon, tone, title, desc }: { icon: React.ReactNode; tone: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone}`}>{icon}</span>
      <div>
        <p className="text-[15px] font-semibold text-ink tracking-[-0.01em]">{title}</p>
        <p className="text-sm text-ink-2">{desc}</p>
      </div>
    </div>
  )
}
