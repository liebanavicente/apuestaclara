import Link from 'next/link'

export const metadata = { title: 'Herramientas — GañanesBets' }

const TOOLS = [
  {
    emoji: '⚡',
    title: 'Generador de combinadas',
    desc: 'Busca partidos con cuotas reales, selecciona tus picks y genera una combinada. Puedes analizarla con IA o simularla.',
    href: '/generador',
    cta: 'Ir al generador',
  },
  {
    emoji: '🎲',
    title: 'Simulador',
    desc: 'Simula combinadas sin dinero real. Entiende la varianza, la probabilidad implícita y el riesgo antes de apostar.',
    href: '/simulador',
    cta: 'Ir al simulador',
  },
  {
    emoji: '🤖',
    title: 'Análisis con IA',
    desc: 'Selecciona tus picks en el generador y pídele a la IA un análisis razonado de cada selección y de la combinada.',
    href: '/generador',
    cta: 'Abrir generador',
  },
  {
    emoji: '📅',
    title: 'Buscador de eventos',
    desc: 'Consulta cuotas reales de múltiples casas para miles de partidos. Filtra por liga, deporte y mercado.',
    href: '/buscar-eventos',
    cta: 'Buscar eventos',
  },
]

export default function HerramientasPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-white mb-2">Herramientas de análisis</h1>
        <p className="text-slate-400 text-sm">
          Estas herramientas son independientes de la competición. Úsalas para analizar combinadas, simular resultados o consultar cuotas — sin que afecte a tu ranking.
        </p>
      </div>

      <div className="space-y-4">
        {TOOLS.map(tool => (
          <div key={tool.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
            <span className="text-3xl shrink-0">{tool.emoji}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold mb-1">{tool.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">{tool.desc}</p>
              <Link href={tool.href}
                className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
                {tool.cta} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-700 text-xs text-center mt-10">
        Las predicciones son orientativas y pueden fallar. Apostar implica riesgo económico real.
      </p>
    </main>
  )
}
