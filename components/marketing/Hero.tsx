import Image from 'next/image'
import Link from 'next/link'
import { FloatingBackground } from './FloatingBackground'
import { Confetti } from './Confetti'

export function Hero() {
  return (
    <section className="relative z-0 flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-20">
      {/* Background photo */}
      <Image
        src="/spain-hero.webp"
        alt=""
        fill
        priority
        className="-z-40 object-cover object-[50%_30%]"
      />
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            'linear-gradient(160deg, rgba(122,12,30,0.88) 0%, rgba(74,15,36,0.85) 28%, rgba(11,30,63,0.88) 62%, rgba(10,18,32,0.94) 100%)',
        }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-20" />
      <div className="grain-overlay pointer-events-none absolute inset-0 -z-20" />
      <Confetti density={36} />
      <FloatingBackground />

      {/* Illuminated glow orbs */}
      <div
        className="glow-orb pointer-events-none absolute left-[26%] top-[36%] -z-10 h-[440px] w-[440px] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(198,11,30,0.55) 0%, transparent 70%)' }}
      />
      <div
        className="glow-orb pointer-events-none absolute left-[74%] top-[62%] -z-10 h-[340px] w-[340px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(255,196,0,0.45) 0%, transparent 70%)', animationDelay: '2s' }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Copy */}
        <div className="max-w-2xl text-center lg:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amarillo/30 bg-amarillo/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[2px] text-amarillo">
            🇪🇸 Edición especial · Final del Mundial
          </span>

          <h1
            className="font-display text-6xl leading-[0.95] tracking-wide text-white sm:text-8xl"
            style={{ textShadow: '0 4px 30px rgba(198,11,30,0.5), 0 0 80px rgba(255,196,0,0.25)' }}
          >
            🏆 ¡Españita a la final!
          </h1>

          <p className="mt-7 font-display text-3xl tracking-wide text-amarillo sm:text-4xl">
            🍻 Se acercan las birras.
          </p>

          <p className="mt-4 text-lg text-texto-secundario sm:text-xl">
            Elige el resultado de la Final y sigue arrasando en la Champions.
            <br />
            Sin dinero real. Solo el orgullo.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/register?redirect=/dashboard"
              className="shine-btn w-full rounded-xl bg-rojo px-10 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(198,11,30,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_45px_rgba(198,11,30,0.65)] sm:w-auto sm:text-lg"
            >
              🏆 Entrar a la fiesta
            </Link>
            <a
              href="#partidos"
              className="w-full rounded-xl border border-amarillo/60 px-10 py-4 text-base font-semibold text-amarillo transition-colors hover:bg-amarillo/10 sm:w-auto sm:text-lg"
            >
              ↓ Ver cómo funciona
            </a>
          </div>
        </div>

        {/* Demo card flotante */}
        <div className="hidden w-full max-w-xs shrink-0 animate-float lg:block" style={{ animationDuration: '4s' }}>
          <div className="glass rounded-2xl p-5 shadow-2xl shadow-[0_0_50px_rgba(198,11,30,0.18)]">
            <p className="mb-1 text-xs font-semibold text-texto-secundario">🇪🇸 España vs Argentina</p>
            <p className="mb-4 text-xs text-texto-terciario">Final del Mundial · Domingo 20:00</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1', odds: '2.10' },
                { label: 'X', odds: '3.25' },
                { label: '2', odds: '3.80' },
              ].map(({ label, odds }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-lg border border-superficie-hover bg-superficie-hover/60 py-2 text-center"
                >
                  <span className="text-[10px] text-texto-terciario">{label}</span>
                  <span className="font-mono text-sm font-bold text-white">{odds}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
