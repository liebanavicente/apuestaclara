import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-20">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, #0B3D2E 0%, rgba(11,61,46,0.5) 55%, #121212 100%)',
        }}
      />
      <div className="grain-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Copy */}
        <div className="max-w-xl text-center lg:text-left">
          <div className="mb-6 text-5xl sm:text-6xl animate-float lg:hidden">🐟</div>

          <h1
            className="font-display text-5xl leading-none tracking-wide text-[#F5F5F5] sm:text-7xl"
            style={{ textShadow: '0 4px 20px rgba(0,230,118,0.3)' }}
          >
            Quien pierda paga unas birras
          </h1>

          <p className="mt-6 text-base text-texto-secundario sm:text-xl">
            Elige resultados del Mundial y Champions.
            <br />
            Sin dinero real. Solo el orgullo.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/register?redirect=/dashboard"
              className="w-full rounded-xl bg-neon px-10 py-4 text-base font-bold text-[#0B3D2E] shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_45px_rgba(0,230,118,0.6)] sm:w-auto"
            >
              🚀 Entrar a GañanesBets
            </Link>
            <a
              href="#partidos"
              className="w-full rounded-xl border border-neon px-10 py-4 text-base font-semibold text-neon transition-colors hover:bg-neon/10 sm:w-auto"
            >
              ↓ Ver cómo funciona
            </a>
          </div>
        </div>

        {/* Demo card flotante */}
        <div className="hidden w-full max-w-xs shrink-0 animate-float lg:block" style={{ animationDuration: '4s' }}>
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-5 shadow-2xl">
            <p className="mb-1 text-xs font-semibold text-texto-secundario">⚽ Real Madrid vs Barça</p>
            <p className="mb-4 text-xs text-texto-terciario">Champions · Hoy 21:00</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1', odds: '1.85' },
                { label: 'X', odds: '3.40' },
                { label: '2', odds: '4.20' },
              ].map(({ label, odds }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-lg border border-[#2A2A2A] bg-[#2A2A2A]/40 py-2 text-center"
                >
                  <span className="text-[10px] text-texto-terciario">{label}</span>
                  <span className="font-mono text-sm font-bold text-[#F5F5F5]">{odds}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
