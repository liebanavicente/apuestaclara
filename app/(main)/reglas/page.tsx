export const metadata = { title: 'Reglas — GañanesBets 🐟' }

const WORLD_CUP_FINAL = new Date('2026-07-19T20:00:00Z')

export default function ReglasPage() {
  const now = new Date()
  const diff = WORLD_CUP_FINAL.getTime() - now.getTime()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🐟🍺🏆</div>
        <h1 className="text-4xl font-black text-white mb-3">Reglamento Gañanes</h1>
        <p className="text-yellow-400 text-lg font-semibold">Temporada Mundial 2026</p>
      </div>

      {/* Countdown */}
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 mb-10 text-center">
        <p className="text-slate-400 text-sm mb-1">Tiempo hasta la final</p>
        <p className="text-5xl font-black text-yellow-400">{days}</p>
        <p className="text-slate-400 text-sm mt-1">días</p>
        <p className="text-slate-600 text-xs mt-3">19 jul 2026 · Final del Mundial · MetLife Stadium</p>
      </div>

      <div className="space-y-5">

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎯</span>
            <h2 className="text-lg font-bold text-white">Cómo funciona</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• Entras, ves los partidos del Mundial y la Champions, y eliges 1 / X / 2.</li>
            <li>• Puedes anticiparte: los partidos del Mundial ya están disponibles aunque queden semanas. Las cuotas cambian, así que apostar antes puede salir mejor o peor.</li>
            <li>• Cuando acaba el partido, marcas si acertaste o fallaste en <strong className="text-white">Mis picks</strong>.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📊</span>
            <h2 className="text-lg font-bold text-white">Puntuación</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• <strong className="text-white">Acierto</strong> → ganas <code className="bg-slate-800 px-1.5 py-0.5 rounded text-yellow-300">cuota en puntos</code> (ej. aciertas a 2.10 → +2.10 pts)</li>
            <li>• <strong className="text-white">Fallo</strong> → 0 puntos. No se pierden puntos.</li>
            <li>• El ranking se ordena por <strong className="text-white">puntos totales acumulados</strong>.</li>
            <li>• En caso de empate, gana quien tenga mayor % de acierto.</li>
          </ul>
          <div className="mt-4 rounded-lg bg-slate-800 p-4 text-sm">
            <p className="text-slate-400 mb-2">Ejemplo:</p>
            <p className="text-slate-300">Aciertas <strong className="text-white">España gana</strong> con cuota <strong className="text-white">1.85</strong> → <span className="text-green-400">+1.85 pts</span></p>
            <p className="text-slate-300 mt-1">Fallas <strong className="text-white">Empate</strong> con cuota <strong className="text-white">3.40</strong> → <span className="text-slate-500">+0 pts</span></p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🍺</span>
            <h2 className="text-lg font-bold text-white">El premio</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• <strong className="text-yellow-400">Último clasificado</strong> paga una ronda de birras a todos.</li>
            <li>• <strong className="text-white">Primero clasificado</strong> elige el bar.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📅</span>
            <h2 className="text-lg font-bold text-white">Fin de la competición</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• La competición termina con la <strong className="text-white">final del Mundial 2026</strong> (19 jul 2026).</li>
            <li>• Los picks pendientes al cierre se resuelven en las 48h siguientes.</li>
            <li>• El ranking final se congela y es oficial.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🤝</span>
            <h2 className="text-lg font-bold text-white">Código Gañán</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>• <strong className="text-white">Honor system</strong>: tú mismo resuelves tus picks. Si haces trampas eres un gañán (en el mal sentido).</li>
            <li>• Puedes eliminar un pick pendiente antes del partido si te equivocaste al seleccionar.</li>
            <li>• Nada de resolver picks con el partido ya empezado.</li>
            <li>• El admin (<span className="text-yellow-400">Miguel</span>) puede invalidar picks trampa.</li>
          </ul>
        </div>

      </div>

      <div className="mt-10 flex gap-3 justify-center">
        <a href="/dashboard" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-6 py-3 rounded-lg transition-colors">
          ⚽ Hacer picks
        </a>
        <a href="/ranking" className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          🏆 Ranking
        </a>
      </div>
    </main>
  )
}
