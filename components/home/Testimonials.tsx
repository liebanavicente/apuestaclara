const TESTIMONIALS = [
  {
    quote:
      'Por fin un sitio donde la peña competimos en serio. El ranking transparente lo cambia todo, ya no hay discusiones sobre quién acertó.',
    name: 'Carlos M.',
    role: 'Grupo "Los del bar"',
    initial: 'C',
  },
  {
    quote:
      'El analizador me ayuda a entender por qué una cuota es alta antes de mojarme. Se nota que está hecho con cabeza, no como una casa de apuestas.',
    name: 'Laura T.',
    role: 'Usuaria Premium',
    initial: 'L',
  },
  {
    quote:
      'Llevamos toda la Champions picando y el histórico completo es oro. Saber tu porcentaje de acierto real engancha más que el dinero.',
    name: 'Javi R.',
    role: 'Liga de amigos',
    initial: 'J',
  },
]

export function Testimonials() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Comunidad</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Grupos de todo el país ya compiten aquí
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display font-bold text-primary">
                  {t.initial}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
