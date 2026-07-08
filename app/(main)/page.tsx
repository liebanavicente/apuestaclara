import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-28 sm:py-36 text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="text-7xl mb-6">🐟</div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
            Quien pierda{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              paga unas birras.
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-3">
            Elige el resultado de los partidos del Mundial y la Champions.<br />
            Cada acierto suma la cuota en puntos. El último paga la ronda.
          </p>
          <p className="text-slate-600 text-sm mb-10">Sin dinero real. Solo el orgullo.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register?redirect=/dashboard"
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-base transition-colors w-full sm:w-auto">
              Unirme a la competición 🐟
            </Link>
            <Link href="/login?redirect=/dashboard"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors w-full sm:w-auto">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 border-t border-slate-800/50 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-10">Cómo funciona</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '⚽', title: 'Elige el resultado', desc: 'Ves los partidos del Mundial y Champions con cuotas reales. Haces click en 1, X o 2 antes de que empiece.' },
              { emoji: '🎯', title: 'Anticípate', desc: 'Puedes apostar semanas antes. Las cuotas cambian — si apuestas pronto a veces ganas más.' },
              { emoji: '🏆', title: 'Acumula puntos', desc: 'Cada acierto suma la cuota en puntos. El ranking decide quién paga las birras.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puntuación */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-4">La puntuación es simple</h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-left space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-white font-semibold">Aciertas</p>
                <p className="text-slate-400 text-sm">Sumas la cuota en puntos. Aciertas a <strong className="text-white">3.50</strong> → ganas <strong className="text-yellow-400">+3.50 pts</strong></p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-white font-semibold">Fallas</p>
                <p className="text-slate-400 text-sm">No pierdes nada. Solo te quedas sin puntos de ese pick.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">🍺</span>
              <div>
                <p className="text-white font-semibold">Final del Mundial (19 jul 2026)</p>
                <p className="text-slate-400 text-sm">El último del ranking paga la ronda. El primero elige el bar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 text-center px-4 border-t border-slate-800/50">
        <p className="text-3xl font-black text-white mb-2">¿Te apuntas?</p>
        <p className="text-slate-400 mb-8">Regístrate gratis y empieza a hacer picks</p>
        <Link href="/register?redirect=/dashboard"
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-base transition-colors inline-block">
          Entrar a GañanesBets 🐟
        </Link>
        <p className="text-slate-700 text-xs mt-4">
          <Link href="/reglas" className="hover:text-slate-500">Ver reglas completas</Link>
        </p>
      </section>
    </div>
  )
}
