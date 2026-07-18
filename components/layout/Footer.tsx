import Link from 'next/link'
import { Waves } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-neon/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-neon/20 bg-neon/10 text-neon">
                <Waves className="h-4 w-4" />
              </span>
              <span className="font-bold text-white">ApuestaClara</span>
            </Link>
            <p className="text-texto-secundario text-sm leading-relaxed">
              Herramienta social para leer cuotas, hacer picks ficticios y competir por puntos.
              No opera apuestas ni mueve dinero real.
            </p>
            <p className="text-texto-terciario text-xs mt-3 font-medium">+18 · Solo mayores de edad · Juega con responsabilidad</p>
          </div>

          <div>
            <p className="text-texto-secundario font-semibold text-sm mb-3">Plataforma</p>
            <ul className="space-y-2">
              <li><Link href="/generador" className="text-texto-secundario hover:text-neon text-sm transition-colors">Generador</Link></li>
              <li><Link href="/buscar-eventos" className="text-texto-secundario hover:text-neon text-sm transition-colors">Buscar eventos</Link></li>
              <li><Link href="/simulador" className="text-texto-secundario hover:text-neon text-sm transition-colors">Simulador</Link></li>
              <li><Link href="/comunidad" className="text-texto-secundario hover:text-neon text-sm transition-colors">Comunidad</Link></li>
              <li><Link href="/premium" className="text-texto-secundario hover:text-neon text-sm transition-colors">Premium</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-texto-secundario font-semibold text-sm mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/responsable" className="text-texto-secundario hover:text-neon text-sm transition-colors">Juego responsable</Link></li>
              <li><Link href="/privacidad" className="text-texto-secundario hover:text-neon text-sm transition-colors">Privacidad</Link></li>
              <li><Link href="/terminos" className="text-texto-secundario hover:text-neon text-sm transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-superficie-hover flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-texto-terciario text-xs">
            © {new Date().getFullYear()} ApuestaClara · Competición social sin dinero real
          </p>
          <p className="text-texto-terciario text-xs">
            Las predicciones son orientativas y pueden fallar
          </p>
        </div>
      </div>
    </footer>
  )
}
