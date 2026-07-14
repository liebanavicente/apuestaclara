const PARTICLES = [
  { icon: '⚽', top: '12%', left: '6%', size: '2rem', dur: '11s', delay: '0s', dx: '26px', opacity: 0.35 },
  { icon: '🍻', top: '68%', left: '10%', size: '2.4rem', dur: '14s', delay: '1.2s', dx: '-20px', opacity: 0.3 },
  { icon: '🏆', top: '22%', left: '88%', size: '1.9rem', dur: '13s', delay: '2.1s', dx: '-24px', opacity: 0.32 },
  { icon: '⚽', top: '80%', left: '82%', size: '1.6rem', dur: '9s', delay: '0.6s', dx: '18px', opacity: 0.3 },
  { icon: '🍻', top: '38%', left: '92%', size: '1.7rem', dur: '12s', delay: '3s', dx: '-16px', opacity: 0.28 },
  { icon: '⚽', top: '55%', left: '3%', size: '1.5rem', dur: '10s', delay: '1.8s', dx: '22px', opacity: 0.28 },
  { icon: '🏆', top: '85%', left: '45%', size: '1.6rem', dur: '15s', delay: '0.9s', dx: '14px', opacity: 0.26 },
  { icon: '⚽', top: '8%', left: '48%', size: '1.4rem', dur: '10.5s', delay: '2.6s', dx: '-18px', opacity: 0.26 },
  { icon: '🍻', top: '15%', left: '70%', size: '1.5rem', dur: '13.5s', delay: '1.4s', dx: '20px', opacity: 0.28 },
]

export function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute select-none blur-[0.3px]"
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
