import Link from 'next/link'
import { Check, X, ShieldCheck, Trophy, Beer, Calendar, Award } from 'lucide-react'

export const metadata = { title: 'Reglas — GañanesBets 🐟' }

export default function ReglasPage() {
  const sections = [
    {
      icon: Calendar,
      title: 'Cómo se juega',
      items: [
        'Entras a Partidos, ves las cuotas en tiempo real de LaLiga y Champions League y eliges 1 / X / 2.',
        'Puedes anticiparte: las cuotas fluctúan según el mercado oficial de las casas de apuestas.',
        'El sistema resuelve los pronósticos automáticamente una vez finalizado cada partido.',
      ],
    },
    {
      icon: Award,
      title: 'Sistema de puntos',
      items: [
        'Acierto → sumas el valor íntegro de la cuota en puntos (ej. acierto a 2.15 → +2.15 pts).',
        'Fallo → 0 puntos. Nunca se restan puntos.',
        'El ranking se ordena por puntos totales acumulados.',
        'En caso de empate a puntos, desempatará el porcentaje de acierto más alto.',
      ],
    },
    {
      icon: Beer,
      title: 'El premio y el castigo',
      items: [
        'El último clasificado al final de la temporada paga una ronda de birras a todos.',
        'El primer clasificado tiene el honor de elegir el bar.',
      ],
    },
    {
      icon: Trophy,
      title: 'Competiciones oficiales',
      items: [
        'Solo se computan partidos oficiales de LaLiga (España) y UEFA Champions League.',
        'Sin dinero real: juego 100% lúdico para competir en el grupo de amigos.',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Código Gañán',
      items: [
        'Juego limpio: puedes borrar un pronóstico pendiente antes de que empiece el partido.',
        'Una vez iniciado el encuentro, no se admiten cambios ni anulaciones.',
      ],
    },
  ]

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="text-center mb-10 anim-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold mb-3 shadow-xs">
          <span>🐟🍺🏆</span> Reglamento Oficial
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Reglas del Club
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
          Todo lo que necesitas saber sobre el funcionamiento, puntuaciones y las birras en juego.
        </p>
      </div>

      {/* Competitions Card */}
      <div className="rounded-3xl p-6 mb-8 text-center gb-card shadow-xs anim-slide-up border-amber-200/80 bg-amber-50/50">
        <div className="flex items-center justify-center gap-3 text-3xl mb-2">
          <span>🇪🇸</span>
          <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">y</span>
          <span>⭐</span>
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">LaLiga + Champions League</h2>
        <p className="text-slate-500 text-xs mt-1">Partidos oficiales · Cuotas reales · 0€ apostados</p>
        <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/80 border border-amber-200/60 text-amber-800 text-[11px] font-bold shadow-2xs">
          Acierta cuotas altas para despegarte en el ranking
        </div>
      </div>

      {/* Quick Example */}
      <div className="rounded-3xl p-5 mb-8 gb-card shadow-xs anim-slide-up">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Ejemplo visual</span>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
            <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <p className="text-slate-700 text-xs">
              Aciertas <strong>Real Madrid gana</strong> a cuota <strong>1.85</strong> → <span className="text-emerald-700 font-extrabold">+1.85 puntos</span>
            </p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70">
            <span className="w-6 h-6 rounded-full bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center text-xs font-black shrink-0">
              <X className="w-3.5 h-3.5" />
            </span>
            <p className="text-slate-700 text-xs">
              Fallas <strong>Empate</strong> a cuota <strong>3.40</strong> → <span className="text-slate-400 font-semibold">0 puntos (no restas)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 stagger">
        {sections.map(s => {
          const Icon = s.icon
          return (
            <div key={s.title} className="rounded-3xl p-5 gb-card shadow-xs anim-slide-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <Icon className="w-4 h-4 text-slate-700" />
                </div>
                <h2 className="text-slate-900 font-extrabold text-sm">{s.title}</h2>
              </div>
              <ul className="space-y-2 pl-2">
                {s.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all active:scale-95"
        >
          ⚽ Ver partidos y apostar
        </Link>
        <Link
          href="/ranking"
          className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all"
        >
          🏆 Ver clasificación
        </Link>
      </div>
    </main>
  )
}
