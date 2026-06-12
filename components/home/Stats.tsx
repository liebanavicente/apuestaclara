const STATS = [
  { value: '64%', label: 'Acierto medio', detail: 'En picks de la comunidad esta temporada' },
  { value: '1.250+', label: 'Partidos analizados', detail: 'Mundial, Champions y grandes ligas' },
  { value: '8.400+', label: 'Predicciones registradas', detail: 'Con histórico completo y verificable' },
  { value: '100%', label: 'Transparencia', detail: 'Cada acierto y fallo queda registrado' },
]

export function Stats() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Rendimiento real</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Métricas transparentes, sin promesas vacías
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No vendemos certezas. Mostramos el rendimiento histórico tal cual es, para que decidas
            con datos en la mano.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card p-6 transition-colors hover:bg-card/70">
              <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{s.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
