import Link from 'next/link'
import { Play, History, BarChart3, PlusCircle } from 'lucide-react'

export default function SimuladorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <Play className="h-6 w-6 text-teal-400" />
        <h1 className="text-2xl font-bold text-white">Simulador</h1>
      </div>
      <p className="text-sm text-orange-400/80 mb-8">
        Este simulador no usa dinero real. Sirve para aprender sobre cuotas, riesgo y varianza.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/simulador/nueva', icon: PlusCircle, label: 'Nueva simulación', desc: 'Crea una apuesta ficticia' },
          { href: '/simulador/historial', icon: History, label: 'Historial', desc: 'Tus simulaciones pasadas' },
          { href: '/simulador/estadisticas', icon: BarChart3, label: 'Estadísticas', desc: 'Rendimiento y curva' },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href} className="rounded-xl border border-slate-800 bg-slate-900/50 hover:border-teal-500/30 p-5 transition-colors">
            <Icon className="h-6 w-6 text-teal-400 mb-3" />
            <p className="text-white font-medium mb-1">{label}</p>
            <p className="text-slate-500 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
        <p className="text-slate-400 text-sm">El simulador completo está disponible en la Fase 4.</p>
        <p className="text-xs text-orange-400/80 mt-2">Incluso acertar en simulación no garantiza resultados futuros.</p>
      </div>
    </div>
  )
}
