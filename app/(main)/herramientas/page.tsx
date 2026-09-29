import Link from 'next/link'

export const metadata = { title: 'Herramientas — GañanesBets' }

const TOOLS = [
  {
    emoji: '⚡',
    title: 'Generador de combinadas',
    desc: 'Busca partidos con cuotas reales, selecciona tus picks y genera una combinada. Puedes analizarla con IA o simularla.',
    href: '/generador',
    cta: 'Abrir generador',
    accent: 'rgba(234,179,8,0.07)',
    border: 'rgba(234,179,8,0.22)',
    iconBg: 'rgba(234,179,8,0.12)',
    iconColor: '#EAB308',
    glow: '0 0 32px rgba(234,179,8,0.10)',
  },
  {
    emoji: '🎲',
    title: 'Simulador',
    desc: 'Simula combinadas sin dinero real. Entiende la varianza, la probabilidad implícita y el riesgo antes de apostar.',
    href: '/sim',
    cta: 'Abrir simulador',
    accent: 'rgba(255,255,255,0.055)',
    border: 'rgba(255,255,255,0.09)',
    iconBg: 'rgba(255,255,255,0.08)',
    iconColor: 'rgba(255,255,255,0.70)',
    glow: null,
  },
  {
    emoji: '🤖',
    title: 'Análisis con IA',
    desc: 'Selecciona tus picks en el generador y pídele a la IA un análisis razonado de cada selección y de la combinada completa.',
    href: '/generador',
    cta: 'Ir al generador',
    accent: 'rgba(255,255,255,0.055)',
    border: 'rgba(255,255,255,0.09)',
    iconBg: 'rgba(255,255,255,0.08)',
    iconColor: 'rgba(255,255,255,0.70)',
    glow: null,
  },
  {
    emoji: '📅',
    title: 'Buscador de eventos',
    desc: 'Consulta cuotas reales de múltiples casas para miles de partidos. Filtra por liga, deporte y mercado.',
    href: '/buscar-eventos',
    cta: 'Buscar eventos',
    accent: 'rgba(255,255,255,0.055)',
    border: 'rgba(255,255,255,0.09)',
    iconBg: 'rgba(255,255,255,0.08)',
    iconColor: 'rgba(255,255,255,0.70)',
    glow: null,
  },
]

export default function HerramientasPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10 anim-fade-in">
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">🔧 Herramientas</h1>
        <p className="text-white/35 text-sm leading-relaxed">
          Independientes de la competición. Analiza combinadas, simula resultados y consulta cuotas — sin afectar tu ranking.
        </p>
      </div>

      <div className="space-y-3 stagger">
        {TOOLS.map(tool => (
          <div key={tool.title}
            className="rounded-2xl p-5 flex items-start gap-4 transition-all hover:scale-[1.005] anim-slide-up"
            style={{
              background: tool.accent,
              border: `1px solid ${tool.border}`,
              boxShadow: tool.glow
                ? `0 4px 24px rgba(0,0,0,0.30), ${tool.glow}`
                : '0 4px 24px rgba(0,0,0,0.20)',
              backdropFilter: 'blur(12px)',
            }}>
            <span className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: tool.iconBg, border: `1px solid ${tool.border}` }}>
              {tool.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold mb-1">{tool.title}</h2>
              <p className="text-white/45 text-sm leading-relaxed mb-3">{tool.desc}</p>
              <Link href={tool.href}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl transition-all font-black text-[#07080F]"
                style={{ background: 'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow: '0 4px 14px rgba(234,179,8,0.28)' }}>
                {tool.cta} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white/20 text-xs text-center mt-10">
        Las predicciones son orientativas y pueden fallar. Apostar implica riesgo económico real.
      </p>
    </main>
  )
}
