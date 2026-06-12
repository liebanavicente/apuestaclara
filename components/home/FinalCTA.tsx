import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="px-4 pb-20 pt-4 sm:pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] max-w-[150%] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(closest-side, oklch(0.62 0.19 250 / 0.4), transparent)',
            }}
          />
          <h2 className="relative text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            ¿Quién paga la próxima ronda?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
            Reúne a tu grupo, registra tus predicciones y deja que los datos decidan. Gratis,
            sin tarjeta y sin dinero real.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              href="/register?redirect=/dashboard"
              className="group flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              Crear mi cuenta gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="relative mt-4 text-xs text-muted-foreground">
            <Link href="/reglas" className="underline-offset-2 hover:text-foreground hover:underline">
              Ver reglas completas
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
