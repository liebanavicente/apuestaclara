import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/60 backdrop-blur-xl mt-auto transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Brand & Concept */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🐟</span>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">GañanesBets</span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                Solo amigos
              </span>
            </div>
            <p className="text-slate-500 text-xs max-w-md leading-relaxed">
              Juego informal entre amigos sin dinero real. Pronósticos sobre partidos de LaLiga y Champions League con cuotas reales. Quien quede último paga las birras.
            </p>
          </div>

          {/* Center/Right: Quick clean navigation */}
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
              Partidos
            </Link>
            <Link href="/ranking" className="hover:text-slate-900 transition-colors">
              Ranking
            </Link>
            <Link href="/reglas" className="hover:text-slate-900 transition-colors">
              Reglas del Club
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} GañanesBets · Cuotas oficiales vía The Odds API</p>
          <p className="font-medium text-slate-500">⚽ Sin dinero real · 🍺 Birras en juego</p>
        </div>
      </div>
    </footer>
  )
}
