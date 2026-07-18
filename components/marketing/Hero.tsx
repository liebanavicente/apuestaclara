import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Activity, ShieldCheck, Trophy, TrendingUp } from 'lucide-react'
import { FloatingBackground } from './FloatingBackground'

export function Hero() {
  return (
    <section className="market-noise relative z-0 flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-16">
      <Image
        src="/spain-hero.webp"
        alt=""
        fill
        priority
        className="-z-40 object-cover object-[50%_30%] opacity-[0.12] grayscale"
      />
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            'linear-gradient(135deg, rgba(5,7,5,0.92) 0%, rgba(9,17,9,0.86) 44%, rgba(5,7,5,0.98) 100%)',
        }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-20" />
      <div className="grain-overlay pointer-events-none absolute inset-0 -z-20" />
      <FloatingBackground />
      <div
        className="glow-orb pointer-events-none absolute left-[24%] top-[38%] -z-10 h-[460px] w-[460px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(183,255,56,0.26) 0%, transparent 70%)' }}
      />
      <div
        className="glow-orb pointer-events-none absolute left-[76%] top-[58%] -z-10 h-[360px] w-[360px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(94,242,194,0.2) 0%, transparent 70%)', animationDelay: '2s' }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/10 px-4 py-1.5 text-xs font-semibold uppercase text-neon">
            <Activity className="h-3.5 w-3.5" />
            Gananesbets mode · 1X2 social
          </span>

          <h1
            className="font-display text-5xl leading-[0.92] text-white sm:text-7xl lg:text-8xl"
            style={{ textShadow: '0 4px 30px rgba(183,255,56,0.14), 0 0 80px rgba(94,242,194,0.1)' }}
          >
            Gana leyendo cuotas, no apostando dinero.
          </h1>

          <p className="mt-7 text-xl font-semibold text-ambar sm:text-2xl">
            Elige 1, X o 2. Si aciertas, la cuota se convierte en puntos.
          </p>

          <p className="mt-4 max-w-xl text-lg text-texto-secundario sm:text-xl">
            La lógica de Gananesbets vuelve al centro:
            calendario real, picks ficticios, Mundial 2026, ranking y pique entre amigos.
            <br />
            El último sabe lo que le toca.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/register?redirect=/dashboard"
              className="shine-btn inline-flex w-full items-center justify-center gap-2 rounded-md bg-neon px-10 py-4 text-base font-black text-carbon shadow-[0_0_34px_rgba(183,255,56,0.22)] transition-all hover:scale-[1.02] hover:shadow-[0_0_48px_rgba(94,242,194,0.24)] sm:w-auto sm:text-lg"
            >
              Jugar Gananesbets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#partidos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-10 py-4 text-base font-semibold text-white transition-colors hover:border-ambar/50 hover:bg-ambar/10 hover:text-ambar sm:w-auto sm:text-lg"
            >
              Ver partidos
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="w-full max-w-md shrink-0 animate-float" style={{ animationDuration: '4s' }}>
          <div className="cryptix-panel rounded-lg p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-neon">Gananesbets slip</p>
                <p className="mt-1 text-xs text-texto-terciario">Mundial · 1X2 · Ranking</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-neon/20 bg-neon/10 px-2.5 py-1 text-xs font-bold text-neon">
                <Trophy className="h-3 w-3" />
                RANK
              </span>
            </div>

            <div className="mb-5 rounded-md border border-white/10 bg-carbon/70 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">España vs Japón</p>
                  <p className="text-xs text-texto-terciario">Grupo E · Domingo 20:00 · 428 picks</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-neon">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +12.4%
                </div>
              </div>
              <div className="h-16 overflow-hidden rounded-md bg-superficie-hover/60 px-3 py-2">
                <div className="cryptix-line mt-8 h-px" />
                <svg viewBox="0 0 240 54" className="-mt-10 h-14 w-full text-neon" aria-hidden="true">
                  <path
                    d="M0 42 C22 38 32 16 54 24 C74 31 82 45 104 33 C126 21 137 10 158 17 C181 24 184 43 207 30 C222 22 230 18 240 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                { label: '1', odds: '2.10', move: '+0.08' },
                { label: 'X', odds: '3.25', move: '-0.04' },
                { label: '2', odds: '3.80', move: '+0.12' },
              ].map(({ label, odds }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-md border border-neon/10 bg-superficie-hover/70 py-3 text-center"
                >
                  <span className="text-[10px] text-texto-terciario">{label}</span>
                  <span className="font-mono text-lg font-bold text-white">{odds}</span>
                  <span className="font-mono text-[10px] text-ambar">{label === 'X' ? '-0.04' : label === '1' ? '+0.08' : '+0.12'}</span>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-white/10 bg-carbon/60 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-texto-secundario">
                <ShieldCheck className="h-3.5 w-3.5 text-neon" />
                Pick sin dinero real
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-superficie-hover">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-neon to-ambar" />
              </div>
              <p className="mt-2 text-xs text-texto-terciario">66% de confianza social · +3.80 pts potenciales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
