const PARTICLES = [
  { icon: '1.82', top: '12%', left: '6%', size: '0.8rem', dur: '11s', delay: '0s', dx: '26px', opacity: 0.28 },
  { icon: '+0.14', top: '68%', left: '10%', size: '0.8rem', dur: '14s', delay: '1.2s', dx: '-20px', opacity: 0.24 },
  { icon: '2.40', top: '22%', left: '88%', size: '0.8rem', dur: '13s', delay: '2.1s', dx: '-24px', opacity: 0.26 },
  { icon: 'X', top: '80%', left: '82%', size: '0.9rem', dur: '9s', delay: '0.6s', dx: '18px', opacity: 0.26 },
  { icon: '3.10', top: '38%', left: '92%', size: '0.8rem', dur: '12s', delay: '3s', dx: '-16px', opacity: 0.22 },
  { icon: '1X2', top: '55%', left: '3%', size: '0.75rem', dur: '10s', delay: '1.8s', dx: '22px', opacity: 0.22 },
  { icon: '+3.80', top: '85%', left: '45%', size: '0.75rem', dur: '15s', delay: '0.9s', dx: '14px', opacity: 0.2 },
  { icon: '62%', top: '8%', left: '48%', size: '0.75rem', dur: '10.5s', delay: '2.6s', dx: '-18px', opacity: 0.22 },
  { icon: 'LIVE', top: '15%', left: '70%', size: '0.75rem', dur: '13.5s', delay: '1.4s', dx: '20px', opacity: 0.24 },
]

export function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute select-none rounded-full border border-neon/10 bg-neon/5 px-2 py-1 font-mono font-semibold text-neon blur-[0.2px]"
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            '--dur': p.dur,
            '--delay': p.delay,
            '--dx': p.dx,
          } as React.CSSProperties}
        >
          {p.icon}
        </span>
      ))}
    </div>
  )
}
