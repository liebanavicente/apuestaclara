import Link from 'next/link'
import { Activity } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-foreground text-lg tracking-tight">
                Gañanes<span className="text-primary">Bets</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Predicciones de fútbol impulsadas por datos. Analiza partidos, compite con tu grupo
              y mide tu rendimiento con total transparencia.
            </p>
            <p className="text-muted-foreground/70 text-xs mt-4 font-medium">
              +18 · Sin dinero real · Juego social y responsable
            </p>
          </div>

          <div>
            <p className="text-foreground font-semibold text-sm mb-4">Plataforma</p>
            <ul className="space-y-2.5">
              <li><Link href="/generador" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Generador</Link></li>
              <li><Link href="/buscar-eventos" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Buscar eventos</Link></li>
              <li><Link href="/simulador" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Simulador</Link></li>
              <li><Link href="/comunidad" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Comunidad</Link></li>
              <li><Link href="/premium" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Premium</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-foreground font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><Link href="/responsable" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Juego responsable</Link></li>
              <li><Link href="/privacidad" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacidad</Link></li>
              <li><Link href="/terminos" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground/70 text-xs">
            © {new Date().getFullYear()} GañanesBets · Predicciones orientativas
          </p>
          <p className="text-muted-foreground/70 text-xs">
            Las predicciones son orientativas y pueden fallar.
          </p>
        </div>
      </div>
    </footer>
  )
}
