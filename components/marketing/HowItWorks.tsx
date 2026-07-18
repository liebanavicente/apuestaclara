import { Reveal } from './Reveal'

const STEPS = [
  {
    emoji: '01',
    title: 'Elige 1X2',
    desc: 'Entra al calendario y marca local, empate o visitante antes del inicio.',
  },
  {
    emoji: '02',
    title: 'Confirma pick',
    desc: 'Tu selección queda guardada con su cuota y puntos potenciales.',
  },
  {
    emoji: '03',
    title: 'Suma cuota',
    desc: 'Si aciertas, la cuota suma puntos. Si fallas, cero. Sin dinero real.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs font-semibold uppercase text-neon">Signal workflow</p>
          <h2 className="font-display text-4xl leading-[0.98] text-[#FFFFFF] sm:text-6xl">
            Las reglas de Gananesbets, sin maquillaje
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-texto-secundario">
            El diseño puede ser premium, pero la gracia sigue siendo la misma:
            escoger mejor que tus colegas y sobrevivir a la tabla.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute left-1/2 top-8 hidden h-[2px] w-3/5 -translate-x-1/2 sm:block"
            style={{ background: 'linear-gradient(90deg, transparent, #B7FF38, #5EF2C2, transparent)' }}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 200}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-neon/30 bg-carbon font-mono text-sm font-black text-neon shadow-[0_0_34px_rgba(183,255,56,0.14)]">
                    {step.emoji}
                  </div>
                  <div className="cryptix-panel relative w-full rounded-lg p-8">
                    <span className="pointer-events-none absolute right-4 top-3 font-mono text-xs uppercase text-neon/60">
                      Phase {i + 1}
                    </span>
                    <h3 className="relative text-2xl font-bold text-[#FFFFFF]">{step.title}</h3>
                    <p className="relative mt-2 text-base leading-relaxed text-texto-secundario">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
