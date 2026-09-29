import Link from 'next/link'
import { Check, Minus, ShieldCheck, Trophy, Beer, Calendar, Award, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Reglas — GañanesBets 🐟' }

const SECTIONS = [
  {
    icon: Calendar,
    title: 'Cómo se juega',
    items: [
      'Entras en Partidos, ves las cuotas en tiempo real de LaLiga y Champions y eliges 1 / X / 2.',
      'Puedes anticiparte: las cuotas se mueven con el mercado de las casas de apuestas.',
      'Los pronósticos se resuelven automáticamente cuando termina cada partido.',
    ],
  },
  {
    icon: Award,
    title: 'Sistema de puntos',
    items: [
      'Acierto → sumas la cuota entera en puntos (acierto a 2.15 → +2.15 pts).',
      'Fallo → 0 puntos. Nunca se restan puntos.',
      'El ranking se ordena por puntos totales acumulados.',
      'Si hay empate a puntos, desempata el mayor porcentaje de acierto.',
    ],
  },
  {
    icon: Beer,
    title: 'Premio y castigo',
    items: [
      'El último clasificado al final de la temporada paga una ronda de birras a todos.',
      'El primero tiene el honor de elegir el bar.',
    ],
  },
  {
    icon: Trophy,
    title: 'Competiciones',
    items: [
      'Solo cuentan partidos oficiales de LaLiga y UEFA Champions League.',
      'Sin dinero real: juego 100 % lúdico para competir entre amigos.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Código Gañán',
    items: [
      'Puedes borrar un pronóstico pendiente antes de que empiece el partido.',
      'Una vez empezado, no se admiten cambios ni anulaciones.',
    ],
  },
]

export default function ReglasPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      <div className="text-center mb-10 anim-fade-in">
        <p className="text-3xl mb-3">🐟🍺🏆</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">Reglas del club</h1>
        <p className="text-ink-2 text-[15px] mt-3 max-w-md mx-auto">
          Cómo se juega, cómo se puntúa y quién paga las birras.
        </p>
      </div>

      {/* Example */}
      <div className="gb-card rounded-3xl overflow-hidden divide-y divide-black/[0.06] mb-8 anim-slide-up">
        <div className="flex items-center gap-3.5 px-5 py-4">
          <span className="w-8 h-8 rounded-full bg-emerald-500/12 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </span>
          <p className="text-[15px] text-ink-2 flex-1">
            Aciertas <span className="text-ink font-medium">Real Madrid gana</span> a 1.85
          </p>
          <span className="text-[15px] font-semibold text-emerald-600 tabular-nums">+1.85</span>
        </div>
        <div className="flex items-center gap-3.5 px-5 py-4">
          <span className="w-8 h-8 rounded-full bg-black/[0.05] text-ink-3 flex items-center justify-center shrink-0">
            <Minus className="w-4 h-4" />
          </span>
          <p className="text-[15px] text-ink-2 flex-1">
            Fallas <span className="text-ink font-medium">Empate</span> a 3.40
          </p>
          <span className="text-[15px] font-semibold text-ink-3 tabular-nums">0</span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3 stagger">
        {SECTIONS.map(({ icon: Icon, title, items }) => (
          <section key={title} className="gb-card rounded-3xl p-5 sm:p-6 anim-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-[10px] bg-amber-500/12 text-amber-600 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <h2 className="text-ink font-semibold text-[17px] tracking-[-0.02em]">{title}</h2>
            </div>
            <ul className="space-y-2 pl-11">
              {items.map(item => (
                <li key={item} className="text-[15px] text-ink-2 leading-relaxed list-disc marker:text-ink-3/60">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/dashboard" className="gb-btn gb-btn-primary w-full sm:w-auto">
          Ver partidos <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/ranking" className="gb-btn gb-btn-secondary w-full sm:w-auto">
          Clasificación
        </Link>
      </div>
    </div>
  )
}
