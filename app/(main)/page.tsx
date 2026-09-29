import Link from 'next/link'
import { Calendar, Trophy, Beer, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero — Apple clean typography with subtle frosted glow */}
      <section className="relative py-20 sm:py-28 text-center px-4 overflow-hidden">
        <div className="relative max-w-3xl mx-auto anim-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700 mb-6 backdrop-blur-xl">
            <span>🐟</span>
            <span>Club de pronósticos entre amigos</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-amber-700">LaLiga & Champions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight mb-5">
            Quien pierda{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500">
              paga la ronda de birras.
            </span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Pronostica gratis sobre todos los partidos oficiales de LaLiga y Champions League con cuotas reales. Gana el que más acierte.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all shadow-md shadow-slate-900/10 active:scale-95 w-full sm:w-auto"
            >
              <span>Ver partidos y jugar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ranking"
              className="flex items-center justify-center gap-2 bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 font-bold px-8 py-3.5 rounded-full text-sm shadow-xs transition-all w-full sm:w-auto"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Ver clasificación</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards — Apple Frosted Glass */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {[
            {
              icon: Calendar,
              title: 'LaLiga & Champions League',
              desc: 'Cuotas oficiales en tiempo real de cada jornada. Elige victoria local, empate o visitante.',
              badge: 'Oficial',
            },
            {
              icon: Trophy,
              title: 'Acierto = Cuota en puntos',
              desc: 'Si aciertas a cuota 2.50, sumas +2.50 puntos en el ranking. Si fallas, no restas nada.',
              badge: 'Puntuación',
            },
            {
              icon: Beer,
              title: 'La ronda en juego',
              desc: 'El último clasificado al final paga las cervezas. El primero tiene el honor de elegir el bar.',
              badge: 'Premio',
            },
          ].map(({ icon: Icon, title, desc, badge }) => (
            <div
              key={title}
              className="rounded-3xl p-6 gb-card shadow-xs anim-slide-up hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Icon className="w-5 h-5 text-slate-800" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/60 uppercase tracking-wider">
                    {badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Simple Scoring Card */}
      <section className="py-12 px-4 max-w-2xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8 gb-card shadow-xs">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Reglas directas y sencillas</h2>
            <p className="text-xs text-slate-400 mt-1">Sin letra pequeña ni depósitos de dinero</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">Aciertas tu pick:</strong> Sumas la cuota entera en puntos en el ranking (ej. cuota 3.20 = +3.20 pts).
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0" />
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">Fallas tu pick:</strong> Te quedas con 0 puntos ese partido. No se restan puntos jamás.
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70">
              <Beer className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">Al terminar la temporada:</strong> El último del ranking invita a la ronda a los miembros del club.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-center px-4">
        <div className="max-w-md mx-auto">
          <p className="text-2xl font-black text-slate-900 mb-2">¿Listo para demostrar quién sabe de fútbol?</p>
          <p className="text-slate-500 text-xs mb-6">Únete en 10 segundos, no necesitas contraseña.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md shadow-slate-900/10 transition-all active:scale-95"
          >
            <span>Entrar a GañanesBets 🐟</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
