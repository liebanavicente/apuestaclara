import { Reveal } from './Reveal'

const STEPS = [
  {
    emoji: '⚽',
    title: 'Elige resultado',
    desc: 'Click en 1, X o 2 antes del pitido inicial.',
  },
  {
    emoji: '🎯',
    title: 'Anticípate',
    desc: 'Apuesta semanas antes. Cuotas dinámicas.',
  },
  {
    emoji: '🏆',
    title: 'Acumula puntos',
    desc: 'Cada acierto suma la cuota en puntos.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-14 text-center font-display text-4xl tracking-wide text-[#FFFFFF] sm:text-6xl">
          ¿Cómo funciona? Es más fácil que un penalti...
        </h2>

        <div className="relative">
          <div
            className="absolute left-1/2 top-8 hidden h-[2px] w-3/5 -translate-x-1/2 sm:block"
            style={{ background: 'linear-gradient(90deg, #C60B1E, #FFC400)' }}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 200}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-neon bg-[#10203F] text-2xl text-neon">
                    {step.emoji}
                  </div>
                  <div className="relative w-full rounded-2xl border border-[#1B2E54] bg-[#10203F] p-8">
                    <span className="pointer-events-none absolute right-4 top-2 font-display text-5xl text-neon opacity-30">
                      {i + 1}
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
