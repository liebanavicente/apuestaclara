'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Friend } from '@/lib/services/club.service'

interface HeaderProps {
  friend?: Friend | null
  profile?: any
  access?: any
  onSignOut?: () => void
  onOpenSelector?: () => void
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Partidos', icon: '⚽' },
  { href: '/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/sim', label: 'Simulador', icon: '🎲' },
  { href: '/reglas', label: 'Reglas', icon: '📋' },
  { href: '/herramientas', label: 'Herramientas', icon: '🔧' },
]

const TAGLINES = [
  'quien pierda paga unas birras',
  'apuestas ficticias, birras reales',
  'aquí se viene a perder con estilo',
  'el último paga la ronda',
  'birras o gloria, no hay más opciones',
]

export function Header({ friend, onSignOut, onOpenSelector }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const tagline = TAGLINES[Math.floor(Math.abs(Math.sin(Date.now() / 86400000) * TAGLINES.length))]

  return (
    <header className="sticky top-0 z-50 bg-[#07080F]/75 backdrop-blur-xl border-b border-white/[0.07]"
      style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.05)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform inline-block">🐟</span>
            <div className="hidden sm:block">
              <span className="font-black text-white text-[15px] tracking-tight">GañanesBets</span>
              <span className="block text-[9px] text-white/30 leading-none mt-0.5">{tagline}</span>
            </div>
            <span className="sm:hidden font-black text-white text-[15px]">GañanesBets</span>
          </Link>

          {/* Desktop nav — glass pill */}
          <nav className="hidden lg:flex items-center rounded-full px-1.5 py-1.5 gap-0.5"
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.10)' }}>
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all',
                    active
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/75'
                  )}
                  style={active ? {
                    background: 'rgba(255,255,255,0.13)',
                    border: '1px solid rgba(255,255,255,0.16)',
                  } : {}}
                >
                  <span className="mr-1">{icon}</span>{label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {friend ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 transition-all px-3 py-1.5 rounded-2xl hover:bg-white/[0.08]"
                  style={{
                    background: 'rgba(234,179,8,0.08)',
                    border: '1px solid rgba(234,179,8,0.22)',
                  }}
                >
                  <span className="text-lg">{friend.avatarEmoji}</span>
                  <span className="font-bold text-sm text-white">{friend.name}</span>
                  <span className="text-white/25 text-xs">▾</span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-2xl py-2 z-50 shadow-2xl"
                    style={{ background:'rgba(15,23,42,0.98)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(20px)' }}>
                    <div className="px-4 py-2 border-b border-white/[0.08]">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Conectado como</p>
                      <p className="text-white font-black text-sm truncate flex items-center gap-1.5 mt-0.5">
                        <span>{friend.avatarEmoji}</span> {friend.name}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link href="/dashboard"
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                        onClick={() => setAccountOpen(false)}>
                        ⚽ Hacer picks
                      </Link>
                      <Link href="/ranking"
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                        onClick={() => setAccountOpen(false)}>
                        🏆 Ver Ranking
                      </Link>
                      <button
                        onClick={() => { setAccountOpen(false); onOpenSelector?.() }}
                        className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/[0.08] transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Cambiar de amigo
                      </button>
                    </div>

                    <div className="my-1 border-t border-white/[0.08]" />
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-white/40 hover:text-red-400 hover:bg-white/[0.04] transition-colors">
                      Cerrar sesión 👋
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenSelector}
                className="flex items-center gap-2 text-sm font-black px-4 py-2 rounded-full transition-all text-[#07080F]"
                style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 4px 16px rgba(234,179,8,0.30)' }}>
                <span>🐟</span> ¿Quién eres? / Entrar
              </button>
            )}

            {/* Mobile burger */}
            <button
              className="lg:hidden p-1.5 text-white/50 hover:text-white hover:bg-white/[0.07] rounded-lg transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.07]"
          style={{ background:'rgba(7,8,15,0.95)', backdropFilter:'blur(20px)' }}>
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-white/[0.10] text-white border border-white/[0.12]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                )}
                onClick={() => setMobileOpen(false)}
              >
                <span>{icon}</span>{label}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/[0.08]">
              {friend ? (
                <button
                  onClick={() => { setMobileOpen(false); onOpenSelector?.() }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-yellow-400 bg-yellow-400/10"
                >
                  <span className="flex items-center gap-2">
                    <span>{friend.avatarEmoji}</span> {friend.name}
                  </span>
                  <span className="text-xs text-white/40">Cambiar</span>
                </button>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); onOpenSelector?.() }}
                  className="w-full py-2.5 rounded-xl text-sm font-black text-slate-950 bg-yellow-500 text-center"
                >
                  🐟 ¿Quién eres? / Entrar
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
