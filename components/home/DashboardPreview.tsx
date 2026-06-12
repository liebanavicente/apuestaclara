import { TrendingUp } from 'lucide-react'

const MATCHES = [
  { home: 'España', away: 'Alemania', league: 'Mundial', odds: ['1.95', '3.40', '3.80'], pick: 0, conf: 72 },
  { home: 'Real Madrid', away: 'Man City', league: 'Champions', odds: ['2.50', '3.50', '2.60'], pick: 2, conf: 58 },
  { home: 'Argentina', away: 'Francia', league: 'Mundial', odds: ['2.70', '3.20', '2.55'], pick: 0, conf: 64 },
  { home: 'Inter', away: 'Bayern', league: 'Champions', odds: ['2.90', '3.30', '2.35'], pick: 2, conf: 61 },
]

const LABELS = ['1', 'X', '2']

// Tiny ROI sparkline points (calm upward trend)
const POINTS = [8, 18, 14, 26, 22, 34, 30, 44, 52, 48, 62, 70]

function Sparkline() {
  const width = 240
  const height = 64
  const max = Math.max(...POINTS)
  const min = Math.min(...POINTS)
  const step = width / (POINTS.length - 1)
  const coords = POINTS.map((p, i) => {
    const x = i * step
    const y = height - ((p - min) / (max - min)) * (height - 8) - 4
    return [x, y] as const
  })
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.19 250)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.62 0.19 250)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke="oklch(0.62 0.19 250)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DashboardPreview() {
  return (
    <section className="px-4 pb-8 sm:pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="glass relative overflow-hidden rounded-2xl border border-border/80 p-4 shadow-2xl shadow-black/40 sm:p-6">
          {/* window chrome */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              dashboard.gananesbets
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Prediction table */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground">Próximos partidos</h3>
                <span className="text-xs text-muted-foreground">Cuotas en vivo</span>
              </div>
              <div className="space-y-1.5">
                {MATCHES.map((m) => (
                  <div
                    key={`${m.home}-${m.away}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {m.home} <span className="text-muted-foreground">vs</span> {m.away}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.league}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {m.odds.map((o, i) => (
                        <span
                          key={i}
                          className={
                            'flex h-9 w-11 flex-col items-center justify-center rounded-md border text-[11px] font-semibold leading-none ' +
                            (i === m.pick
                              ? 'border-primary bg-primary/15 text-primary'
                              : 'border-border bg-secondary/40 text-muted-foreground')
                          }
                        >
                          <span className="text-[9px] font-medium opacity-70">{LABELS[i]}</span>
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance widget */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Rendimiento</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-success">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +12.4%
                  </span>
                </div>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">+248 pts</p>
                <Sparkline />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card/60 p-3">
                  <p className="font-display text-xl font-bold text-foreground">64%</p>
                  <p className="text-xs text-muted-foreground">Acierto</p>
                </div>
                <div className="rounded-xl border border-border bg-card/60 p-3">
                  <p className="font-display text-xl font-bold text-foreground">#3</p>
                  <p className="text-xs text-muted-foreground">Ranking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
