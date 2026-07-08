import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A]" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-neon" />
              <span className="font-bold text-white">GañanesBets</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Herramienta de análisis orientativo de combinadas deportivas. No garantizamos beneficios ni aciertos.
              Apostar implica riesgo de pérdida económica.
            </p>
            <p className="text-slate-600 text-xs mt-3 font-medium">+18 · Solo mayores de edad · Juega con responsabilidad</p>
          </div>

          <div>
            <p className="text-slate-300 font-semibold text-sm mb-3">Plataforma</p>
            <ul className="space-y-2">
              <li><Link href="/generador" className="text-slate-500 hover:text-neon text-sm transition-colors">Generador</Link></li>
              <li><Link href="/buscar-eventos" className="text-slate-500 hover:text-neon text-sm transition-colors">Buscar eventos</Link></li>
              <li><Link href="/simulador" className="text-slate-500 hover:text-neon text-sm transition-colors">Simulador</Link></li>
              <li><Link href="/comunidad" className="text-slate-500 hover:text-neon text-sm transition-colors">Comunidad</Link></li>
              <li><Link href="/premium" className="text-slate-500 hover:text-neon text-sm transition-colors">Premium</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-slate-300 font-semibold text-sm mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/responsable" className="text-slate-500 hover:text-neon text-sm transition-colors">Juego responsable</Link></li>
              <li><Link href="/privacidad" className="text-slate-500 hover:text-neon text-sm transition-colors">Privacidad</Link></li>
              <li><Link href="/terminos" className="text-slate-500 hover:text-neon text-sm transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} GañanesBets · Herramienta de análisis orientativo
          </p>
          <p className="text-slate-600 text-xs">
            Las predicciones son orientativas y pueden fallar
          </p>
        </div>
      </div>
    </footer>
  )
}
