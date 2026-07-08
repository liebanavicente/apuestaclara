import Link from 'next/link'
import { Users, Trophy, PlusCircle } from 'lucide-react'

export default function ComunidadPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-white">Comunidad de Picks</h1>
        </div>
        <Link href="/comunidad/nuevo-pick" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <PlusCircle className="h-4 w-4" />
          Publicar pick
        </Link>
      </div>
      <p className="text-xs text-orange-400/80 mb-8">
        Los picks son opiniones personales, no recomendaciones de inversión. Apostar implica riesgo.
      </p>
      <div className="flex gap-4 mb-6">
        <Link href="/comunidad/ranking" className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg text-sm transition-colors">
          <Trophy className="h-4 w-4" />
          Ranking
        </Link>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-10 text-center">
        <p className="text-slate-400">La comunidad completa está disponible en la Fase 5.</p>
      </div>
    </div>
  )
}
