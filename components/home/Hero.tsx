import Link from 'next/link'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Subtle gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] max-w-[140%] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, oklch(0.62 0.19 250 / 0.35), transparent)',
        }}
      />
      <div className="mx-auto max-w-3xl text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Mundial 2026 · Champions League
        </div>

        <h1
          className="animate-fade-up mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
          style={{ animationDelay: '60ms' }}
        >
          Predicciones de fútbol{' '}
          <span className="text-primary">impulsadas por datos</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          style={{ animationDelay: '120ms' }}
        >
          Analiza cada partido con métricas reales, registra tus predicciones y compite con tu
          grupo en una clasificación transparente. Sin dinero real, solo el orgullo.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '180ms' }}
        >
          <Link
            href="/register?redirect=/dashboard"
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 sm:w-auto"
          >
            Empezar gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login?redirect=/dashboard"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-card/50 px-7 text-base font-semibold text-foreground transition-colors hover:border-muted-foreground/40 hover:bg-card sm:w-auto"
          >
            Ya tengo cuenta
          </Link>
        </div>

        <p
          className="animate-fade-up mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground"
          style={{ animationDelay: '240ms' }}
        >
          <ShieldCheck className="h-4 w-4 text-success" />
          Gratis para siempre · Sin tarjeta · Sin apuestas reales
        </p>
      </div>
    </section>
  )
}
