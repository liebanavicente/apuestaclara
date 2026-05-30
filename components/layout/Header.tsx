'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'
import type { UserAccess } from '@/lib/access'

interface HeaderProps {
  profile?: Profile | null
  access?: UserAccess | null
  onSignOut?: () => void
}

const NAV_LINKS = [
  { href: '/dashboard', label: '⚽ Partidos' },
  { href: '/mundial', label: '🌍 Mundial' },
  { href: '/ranking', label: '🏆 Ranking' },
  { href: '/reglas', label: '📋 Reglas' },
  { href: '/herramientas', label: '🔧 Herramientas' },
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
    <header className="sticky top-0 z-50 border-b border-yellow-500/20 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform inline-block">🐟</span>
            <div className="hidden sm:block">
              <span className="font-black text-white text-lg tracking-tight">GañanesBets</span>
              <span className="block text-xs text-yellow-500/70 leading-none -mt-0.5">{tagline}</span>
            </div>
            <span className="sm:hidden font-black text-white text-lg">GañanesBets</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'text-yellow-400 bg-yellow-400/10 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-black text-slate-950">
                      {(profile.username ?? profile.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block font-medium">{profile.username ?? profile.email.split('@')[0]}</span>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-44 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl py-1 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setAccountOpen(false)}>Dashboard</Link>
                    <Link href="/mis-picks" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setAccountOpen(false)}>🎯 Mis picks</Link>
                    <Link href="/ranking" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setAccountOpen(false)}>🏆 Ranking</Link>
                    <Link href="/account" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setAccountOpen(false)}>Mi cuenta</Link>
                    {access?.isAdmin && (
                      <Link href="/admin/debug" className="block px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-slate-800" onClick={() => setAccountOpen(false)}>Admin debug</Link>
                    )}
                    <hr className="border-slate-700 my-1" />
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800">
                      Salir 👋
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login?redirect=/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                  Entrar
                </Link>
                <Link href="/register?redirect=/dashboard" className="text-sm bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-3 py-1.5 rounded-md transition-colors">
                  Únete 🐟
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className="lg:hidden p-1 text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'text-yellow-400 bg-yellow-400/10 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
