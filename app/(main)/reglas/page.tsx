export const metadata = { title: 'Reglas — GañanesBets 🐟' }

export default function ReglasPage() {
  const sections = [
    {
      emoji: '🎯',
      title: 'Cómo funciona',
      items: [
        'Entras, ves los partidos de LaLiga y la Champions League y eliges 1 / X / 2.',
        'Puedes anticiparte: los partidos ya están disponibles antes de que empiece la jornada. Las cuotas cambian — apostar antes puede salir mejor o peor.',
        'El sistema resuelve automáticamente cuando acaba cada partido.',
      ],
    },
    {
      emoji: '📊',
      title: 'Puntuación',
      items: [
        'Acierto → ganas la cuota en puntos (ej. aciertas a 2.10 → +2.10 pts)',
        'Fallo → 0 puntos. No se pierden puntos nunca.',
        'El ranking se ordena por puntos totales acumulados.',
        'En caso de empate, gana quien tenga mayor % de acierto.',
      ],
    },
    {
      emoji: '🍺',
      title: 'El premio',
      items: [
        'Último clasificado paga una ronda de birras a todos.',
        'Primero clasificado elige el bar.',
      ],
    },
    {
      emoji: '📅',
      title: 'Competiciones oficiales',
      items: [
        'Solo se juega con partidos oficiales de LaLiga y UEFA Champions League.',
        'Los picks pendientes se resuelven de forma automática al publicarse los resultados oficiales.',
        'El ranking final acumula todos los puntos logrados en la temporada.',
      ],
    },
    {
      emoji: '🤝',
      title: 'Código Gañán',
      items: [
        'Honor system: si haces trampas eres un gañán (en el mal sentido).',
        'Puedes eliminar un pick pendiente antes de que empiece el partido.',
        'Nada de resolver picks con el partido ya empezado.',
        'El admin (Miguel) puede invalidar picks trampa.',
      ],
    },
  ]

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10 anim-fade-in">
        <div className="text-5xl mb-4 anim-float">🐟🍺🏆</div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Reglamento Gañanes</h1>
        <p className="text-yellow-400/70 font-bold text-sm">LaLiga & Champions League</p>
      </div>

      {/* Competiciones activas banner */}
      <div className="rounded-2xl p-6 mb-8 text-center anim-slide-up"
        style={{
          background: 'rgba(234,179,8,0.07)',
          border: '1px solid rgba(234,179,8,0.22)',
          boxShadow: '0 4px 32px rgba(234,179,8,0.10)',
          backdropFilter: 'blur(12px)',
        }}>
        <div className="flex items-center justify-center gap-3 text-3xl mb-2">
          <span>🇪🇸</span>
          <span className="text-white/20 text-lg font-black">vs</span>
          <span>⭐</span>
        </div>
        <p className="text-xl font-black text-white">LaLiga + UEFA Champions League</p>
        <p className="text-white/40 text-sm mt-1">Todos los partidos oficiales · Cuotas reales · Sin dinero real</p>
        <p className="text-yellow-400/80 text-xs mt-3 font-semibold">Gana el que más acierta sumando cuotas en puntos</p>
      </div>

      {/* Example box */}
      <div className="rounded-2xl p-5 mb-8 anim-slide-up"
        style={{
          background: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(12px)',
        }}>
        <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">Ejemplo rápido</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
              style={{ background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.28)', color: '#22C55E' }}>✓</span>
            <p className="text-white/60 text-sm">Aciertas <strong className="text-white">Real Madrid gana</strong> a cuota <strong className="text-white">1.85</strong> → <span className="text-green-400 font-bold">+1.85 pts</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>✗</span>
            <p className="text-white/60 text-sm">Fallas <strong className="text-white">Empate</strong> a cuota <strong className="text-white">3.40</strong> → <span className="text-white/30 font-bold">+0 pts</span></p>
          </div>
        </div>
      </div>

      {/* Rules sections */}
      <div className="space-y-3 stagger">
        {sections.map(s => (
          <div key={s.title} className="rounded-2xl p-5 anim-slide-up"
            style={{
              background: 'rgba(255,255,255,0.055)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(12px)',
            }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
                {s.emoji}
              </span>
              <h2 className="text-white font-bold">{s.title}</h2>
            </div>
            <ul className="space-y-1.5">
              {s.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/50 leading-relaxed">
                  <span className="text-white/20 mt-0.5 shrink-0">•</span>
                  <span dangerouslySetInnerHTML={{ __html: item
                    .replace(/Acierto/g, '<strong class="text-white">Acierto</strong>')
                    .replace(/Fallo/g, '<strong class="text-white">Fallo</strong>')
                    .replace(/Último clasificado/g, '<strong class="text-yellow-400">Último clasificado</strong>')
                    .replace(/Primero clasificado/g, '<strong class="text-white">Primero clasificado</strong>')
                    .replace(/Miguel/g, '<span class="text-yellow-400">Miguel</span>')
                  }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex gap-3 justify-center">
        <a href="/dashboard"
          className="inline-flex items-center gap-2 font-black px-6 py-3 rounded-2xl transition-all text-[#07080F]"
          style={{ background: 'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow: '0 4px 20px rgba(234,179,8,0.32)' }}>
          ⚽ Hacer picks
        </a>
        <a href="/ranking"
          className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-2xl transition-all text-white/70 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          🏆 Ranking
        </a>
      </div>
    </main>
  )
}
