'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'
import type { UserAccess } from '@/lib/access'

interface HeaderProps {
  profile?: Profile | null
  access?: UserAccess | null
  onSignOut?: () => void
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

export function Header({ profile, access, onSignOut }: HeaderProps) {
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
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
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
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 transition-all px-2 py-1 rounded-xl hover:bg-white/[0.06]"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-yellow-400"
                    style={{ background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.25)' }}>
                    {(profile.username ?? profile.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block font-semibold text-sm text-white/80">{profile.username ?? profile.email.split('@')[0]}</span>
                  <span className="hidden sm:block text-white/25 text-xs">▾</span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-11 w-48 rounded-2xl py-2 z-50"
                    style={{ background:'rgba(10,11,20,0.95)', border:'1px solid rgba(255,255,255,0.10)', backdropFilter:'blur(20px)', boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}>
                    {[
                      { href:'/dashboard', label:'⚽ Partidos' },
                      { href:'/ranking', label:'🏆 Ranking' },
                      { href:'/account', label:'Mi cuenta' },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href}
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg mx-1 transition-colors"
                        onClick={() => setAccountOpen(false)}>{label}</Link>
                    ))}
                    {access?.isAdmin && (
                      <>
                        <div className="my-1 mx-3 border-t border-white/[0.07]" />
                        <Link href="/admin/resolver"
                          className="block px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] rounded-lg mx-1 transition-colors"
                          onClick={() => setAccountOpen(false)}>⚙️ Resolver picks</Link>
                      </>
                    )}
                    <div className="my-1 mx-3 border-t border-white/[0.07]" />
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-white/35 hover:text-white/60 hover:bg-white/[0.04] rounded-lg mx-1 transition-colors">
                      Salir 👋
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login?redirect=/dashboard"
                  className="text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 font-medium">
                  Entrar
                </Link>
                <Link href="/register?redirect=/dashboard"
                  className="text-sm font-black px-4 py-2 rounded-full transition-all text-[#07080F]"
                  style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 4px 16px rgba(234,179,8,0.30)' }}>
                  Únete 🐟
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className="lg:hidden p-1.5 text-white/50 hover:text-white hover:bg-white/[0.07] rounded-lg transition-colors"
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
            {access?.isAdmin && (
              <Link href="/admin/resolver"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/[0.08] transition-colors"
                onClick={() => setMobileOpen(false)}>
                ⚙️ Resolver picks
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
