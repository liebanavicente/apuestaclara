import Link from 'next/link'
import { Check, Star } from 'lucide-react'

const FREE_FEATURES = [
  '3 generaciones diarias',
  'Análisis básico con datos',
  'Historial de las últimas 10 predicciones',
  'Ranking y comunidad',
  'Simulador básico',
]

const PREMIUM_FEATURES = [
  'Hasta 20 generaciones diarias',
  'Análisis ampliado y alternativas',
  'Comparador de riesgo prudente / objetivo / agresivo',
  'Historial completo y favoritos ilimitados',
  'Estadísticas avanzadas y filtros',
  'Simulaciones ilimitadas',
]

export function Pricing() {
  return (
    <section className="border-t border-border/60 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Planes</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Empieza gratis, mejora cuando quieras
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Premium desbloquea más herramientas de análisis. No garantiza beneficios ni aumenta tus
            probabilidades reales de acertar.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-7">
            <p className="font-display text-sm font-semibold text-muted-foreground">Free</p>
            <p className="mt-3 font-display text-4xl font-bold text-foreground">
              0 €
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Para siempre gratis</p>
            <ul className="mt-6 flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register?redirect=/dashboard"
              className="mt-7 flex min-h-12 items-center justify-center rounded-xl border border-border bg-secondary/40 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Empezar gratis
            </Link>
          </div>

          {/* Premium */}
          <div className="relative flex flex-col rounded-2xl border border-primary/50 bg-card p-7 shadow-xl shadow-primary/10">
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
              <Star className="h-3 w-3" /> Más popular
            </span>
            <p className="font-display text-sm font-semibold text-primary">Premium</p>
            <p className="mt-3 font-display text-4xl font-bold text-foreground">
              4,99 €<span className="text-lg font-medium text-muted-foreground">/mes</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Sin permanencia · Cancela cuando quieras</p>
            <ul className="mt-6 flex-1 space-y-3">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/premium"
              className="mt-7 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
            >
              Ver Premium
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              ¿Tienes código? Prueba 1 mes gratis con{' '}
              <span className="font-mono text-primary">PRUEBA1MES</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
