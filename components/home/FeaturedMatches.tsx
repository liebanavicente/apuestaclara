import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const FEATURED = [
  { home: 'España', away: 'Brasil', league: 'Mundial · Grupo C', date: 'Sáb 20:00', odds: ['2.10', '3.30', '3.20'], fav: 0 },
  { home: 'Barcelona', away: 'Liverpool', league: 'Champions · Cuartos', date: 'Mar 21:00', odds: ['2.45', '3.40', '2.70'], fav: 0 },
  { home: 'Portugal', away: 'Países Bajos', league: 'Mundial · Octavos', date: 'Dom 18:00', odds: ['2.55', '3.10', '2.75'], fav: 0 },
]

const LABELS = ['1', 'X', '2']

export function FeaturedMatches() {
  return (
    <section className="border-t border-border/60 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Partidos destacados</p>
            <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Los próximos cruces que todos analizan
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Ver todos los partidos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURED.map((m) => (
            <div
              key={`${m.home}-${m.away}`}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-secondary/60 px-2 py-1 text-xs font-medium text-muted-foreground">
                  {m.league}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{m.date}</span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-foreground">{m.home}</span>
                  <span className="text-xs text-muted-foreground">Local</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-foreground">{m.away}</span>
                  <span className="text-xs text-muted-foreground">Visitante</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
                {m.odds.map((o, i) => (
                  <div
                    key={i}
                    className={
                      'flex flex-col items-center gap-0.5 rounded-lg border py-2 text-sm font-semibold transition-colors ' +
                      (i === m.fav
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/40 text-muted-foreground')
                    }
                  >
                    <span className="text-[10px] font-medium opacity-70">{LABELS[i]}</span>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
