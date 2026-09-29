import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-base">🐟</span>
              <span className="font-semibold text-sm tracking-[-0.01em] text-ink">GañanesBets</span>
            </div>
            <p className="text-ink-3 text-[13px] max-w-sm leading-relaxed">
              Juego entre amigos sin dinero real. Pronósticos de LaLiga y Champions con cuotas reales. Quien quede último paga las birras.
            </p>
          </div>

          <nav className="flex items-center gap-5 text-[13px] text-ink-2" aria-label="Pie de página">
            <Link href="/dashboard" className="hover:text-ink transition-colors">Partidos</Link>
            <Link href="/ranking" className="hover:text-ink transition-colors">Ranking</Link>
            <Link href="/reglas" className="hover:text-ink transition-colors">Reglas</Link>
          </nav>
        </div>

        <div className="mt-6 pt-5 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-ink-3 gap-1.5">
          <p>© {new Date().getFullYear()} GañanesBets · Cuotas vía The Odds API</p>
          <p>Sin dinero real · Birras en juego 🍺</p>
        </div>
      </div>
    </footer>
  )
}
