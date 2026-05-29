export const metadata = { title: 'Reglas — GañanesBets 🐟' }

const WORLD_CUP_FINAL = new Date('2026-07-19T20:00:00Z')

function DaysLeft() {
  const now = new Date()
  const diff = WORLD_CUP_FINAL.getTime() - now.getTime()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  return <>{days}</>
}

export default function ReglasPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🐟🍺🏆</div>
        <h1 className="text-4xl font-black text-white mb-3">Reglamento Gañanes</h1>
        <p className="text-yellow-400 text-lg font-semibold">Temporada Mundial 2026</p>
        <p className="text-slate-500 text-sm mt-2">
          La competición finaliza el <strong className="text-slate-300">19 de julio de 2026</strong> — final del Mundial
        </p>
      </div>

      {/* Countdown banner */}
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 mb-10 text-center">
        <p className="text-slate-400 text-sm mb-1">Tiempo restante</p>
        <p className="text-5xl font-black text-yellow-400">
          <DaysLeft />
        </p>
        <p className="text-slate-400 text-sm mt-1">días hasta la final</p>
        <p className="text-slate-600 text-xs mt-3">19 jul 2026 · Final del Mundial · estadio MetLife, Nueva Jersey</p>
      </div>

      {/* Rules */}
      <div className="space-y-6">

        {/* 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💰</span>
            <h2 className="text-xl font-bold text-white">1. El bankroll</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• Cada jugador empieza con <strong className="text-yellow-400">€1.000 ficticios</strong>.</li>
            <li>• El dinero es completamente ficticio. Nadie pone ni un euro real.</li>
            <li>• No se puede apostar más de lo que tienes en el bankroll.</li>
            <li>• No hay recargas. Si te arruinas, te arruinas.</li>
          </ul>
        </div>

        {/* 2 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎯</span>
            <h2 className="text-xl font-bold text-white">2. Los picks</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• Cada uno publica sus picks <strong className="text-white">antes de que empiece el partido</strong>. Sin trampas.</li>
            <li>• Puedes seleccionar eventos reales con cuotas de la app, o crear un pick manual.</li>
            <li>• No hay límite de picks por día, pero cada uno sale de tu bankroll.</li>
            <li>• Un pick publicado <strong className="text-white">no se puede editar ni eliminar</strong>.</li>
            <li>• Después del partido, tú mismo marcas si acertaste o fallaste. <span className="text-slate-500">(honor system, Gañanes)</span></li>
          </ul>
        </div>

        {/* 3 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h2 className="text-xl font-bold text-white">3. Cómo se gana</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• Si aciertas: ganas <code className="bg-slate-800 px-1.5 py-0.5 rounded text-yellow-300">apuesta × (cuota − 1)</code></li>
            <li>• Si fallas: pierdes <code className="bg-slate-800 px-1.5 py-0.5 rounded text-red-300">la apuesta entera</code></li>
            <li>• El ranking se ordena por <strong className="text-white">bankroll total</strong> al finalizar la competición.</li>
            <li>• En caso de empate, gana quien tenga mayor % de acierto.</li>
          </ul>
          <div className="mt-4 rounded-lg bg-slate-800 p-4 text-sm">
            <p className="text-slate-400 mb-2">Ejemplo:</p>
            <p className="text-slate-300">Apuestas <strong className="text-white">€100</strong> al Madrid con cuota <strong className="text-white">2.10</strong></p>
            <p className="text-green-400 mt-1">✓ Si aciertas: +€110 → bankroll sube a €1.110</p>
            <p className="text-red-400 mt-1">✗ Si fallas: −€100 → bankroll baja a €900</p>
          </div>
        </div>

        {/* 4 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🍺</span>
            <h2 className="text-xl font-bold text-white">4. El premio</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• <strong className="text-yellow-400">Último clasificado</strong> paga una ronda de birras a todos.</li>
            <li>• <strong className="text-white">Primer clasificado</strong> elige el bar.</li>
            <li>• Cualquier modificación del premio debe acordarse por mayoría antes del inicio.</li>
          </ul>
        </div>

        {/* 5 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📅</span>
            <h2 className="text-xl font-bold text-white">5. Fin de la competición</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• La competición termina cuando acabe la <strong className="text-white">final del Mundial 2026</strong> (19 jul 2026).</li>
            <li>• Los picks pendientes al cierre se resolverán en las 48h siguientes.</li>
            <li>• El ranking final se congela al cierre y se hace oficial.</li>
          </ul>
        </div>

        {/* 6 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🤝</span>
            <h2 className="text-xl font-bold text-white">6. Código Gañán</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• <strong className="text-white">Honor system</strong>: tú mismo resuelves tus picks. Si haces trampas, eres un gañán (en el mal sentido).</li>
            <li>• Nada de publicar picks con partido ya empezado. El timestamp no miente.</li>
            <li>• Los picks del Mundial tienen cuota mínima de <strong className="text-white">1.30</strong>. Sin picks de cuota 1.01 al favorito obvio.</li>
            <li>• El admin (<span className="text-yellow-400">Miguel</span>) se reserva el derecho a invalidar picks trampa.</li>
          </ul>
        </div>

      </div>

      {/* CTA */}
      <div className="mt-12 text-center space-y-4">
        <p className="text-slate-500 text-sm">¿Todo claro? Pues a por las birras.</p>
        <div className="flex items-center justify-center gap-4">
          <a href="/ranking" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-6 py-3 rounded-lg transition-colors">
            🏆 Ver ranking
          </a>
          <a href="/mis-picks" className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            🎯 Mis picks
          </a>
        </div>
      </div>

    </main>
  )
}
