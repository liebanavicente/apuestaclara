import { Search, Target, BarChart3, Trophy } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    title: 'Explora los partidos',
    desc: 'Consulta los partidos del Mundial y la Champions con cuotas reales actualizadas.',
  },
  {
    icon: Target,
    title: 'Registra tu predicción',
    desc: 'Elige 1, X o 2 antes de que empiece. Puedes anticiparte semanas antes para mejores cuotas.',
  },
  {
    icon: BarChart3,
    title: 'Analiza con datos',
    desc: 'Usa el analizador para contrastar tu pick con estadísticas y probabilidades.',
  },
  {
    icon: Trophy,
    title: 'Sube en el ranking',
    desc: 'Cada acierto suma la cuota en puntos. La clasificación decide quién paga la ronda.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border/60 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cómo funciona</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            De la corazonada al dato en cuatro pasos
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-card/80"
            >
              <span className="absolute right-5 top-5 font-display text-sm font-bold text-muted-foreground/40">
                0{i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
