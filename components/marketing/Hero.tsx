import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Activity, ShieldCheck } from 'lucide-react'
import { FloatingBackground } from './FloatingBackground'

export function Hero() {
  return (
    <section className="relative z-0 flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-16">
      <Image
        src="/spain-hero.webp"
        alt=""
        fill
        priority
        className="-z-40 object-cover object-[50%_30%] opacity-20 grayscale"
      />
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            'linear-gradient(135deg, rgba(4,8,12,0.86) 0%, rgba(6,39,36,0.82) 44%, rgba(4,8,12,0.96) 100%)',
        }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-20" />
      <div className="grain-overlay pointer-events-none absolute inset-0 -z-20" />
      <FloatingBackground />
      <div
        className="glow-orb pointer-events-none absolute left-[24%] top-[38%] -z-10 h-[460px] w-[460px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(63,245,211,0.34) 0%, transparent 70%)' }}
      />
      <div
        className="glow-orb pointer-events-none absolute left-[76%] top-[58%] -z-10 h-[360px] w-[360px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(215,255,79,0.22) 0%, transparent 70%)', animationDelay: '2s' }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/10 px-4 py-1.5 text-xs font-semibold uppercase text-neon">
            <Activity className="h-3.5 w-3.5" />
            Señal de mercado en tiempo real
          </span>

          <h1
            className="font-display text-5xl leading-[0.95] text-white sm:text-7xl lg:text-8xl"
            style={{ textShadow: '0 4px 30px rgba(63,245,211,0.18), 0 0 80px rgba(215,255,79,0.12)' }}
          >
            Apuestas ficticias. Lectura clara.
          </h1>

          <p className="mt-7 text-xl font-semibold text-ambar sm:text-2xl">
            Compite por puntos leyendo cuotas, calendario y probabilidad.
          </p>

          <p className="mt-4 max-w-xl text-lg text-texto-secundario sm:text-xl">
            Elige 1X2, anticipa movimientos y sube en el ranking.
            <br />
            Sin dinero real. Solo criterio, orgullo y una tabla que no perdona.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/register?redirect=/dashboard"
              className="shine-btn inline-flex w-full items-center justify-center gap-2 rounded-md bg-neon px-10 py-4 text-base font-black text-carbon shadow-[0_0_34px_rgba(63,245,211,0.24)] transition-all hover:scale-[1.02] hover:shadow-[0_0_48px_rgba(63,245,211,0.34)] sm:w-auto sm:text-lg"
            >
              Empezar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#partidos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-10 py-4 text-base font-semibold text-white transition-colors hover:border-ambar/50 hover:bg-ambar/10 hover:text-ambar sm:w-auto sm:text-lg"
            >
              Ver cuotas
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="w-full max-w-sm shrink-0 animate-float" style={{ animationDuration: '4s' }}>
          <div className="glass-strong rounded-lg p-5 shadow-2xl shadow-[0_0_54px_rgba(63,245,211,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-neon">ODDSTIDE board</p>
                <p className="mt-1 text-xs text-texto-terciario">Local vs Visitante · Domingo 20:00</p>
              </div>
              <span className="rounded-full bg-ambar/10 px-2.5 py-1 text-xs font-bold text-ambar">LIVE</span>
            </div>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                { label: '1', odds: '2.10', move: '+0.08' },
                { label: 'X', odds: '3.25', move: '-0.04' },
                { label: '2', odds: '3.80', move: '+0.12' },
              ].map(({ label, odds }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-md border border-neon/10 bg-superficie-hover/60 py-3 text-center"
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
